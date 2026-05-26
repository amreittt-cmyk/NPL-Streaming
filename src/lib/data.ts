import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getHomeData() {
  const [featuredStreams, tournaments, products, streamers] = await Promise.all([
    prisma.stream.findMany({
      orderBy: [{ status: "asc" }, { viewerCount: "desc" }],
      take: 4,
      include: {
        streamer: {
          select: { name: true, avatarUrl: true },
        },
        _count: {
          select: { follows: true, likes: true },
        },
      },
    }),
    prisma.tournament.findMany({
      orderBy: { startDate: "asc" },
      take: 3,
      include: { teams: true },
    }),
    prisma.product.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: UserRole.STREAMER },
      take: 4,
      include: {
        streams: true,
      },
    }),
  ]);

  return { featuredStreams, tournaments, products, streamers };
}

export async function getAdminOverview() {
  const [userCount, streamCount, tournamentCount, productCount, orderCount, sales, liveViewerStats] =
    await Promise.all([
      prisma.user.count(),
      prisma.stream.count(),
      prisma.tournament.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.stream.aggregate({ _sum: { viewerCount: true } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return {
    stats: {
      userCount,
      streamCount,
      tournamentCount,
      productCount,
      orderCount,
      sales: sales._sum.total ?? 0,
      viewers: liveViewerStats._sum.viewerCount ?? 0,
    },
    recentOrders,
    users,
  };
}

export async function getStreamerOverview(userId: string) {
  const streams = await prisma.stream.findMany({
    where: { streamerId: userId },
    include: {
      _count: {
        select: { follows: true, likes: true, chatMessages: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { stream: { streamerId: userId } },
    include: { user: { select: { name: true } }, stream: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return { streams, messages };
}

export async function runGlobalSearch(query: string) {
  if (!query) {
    return {
      products: [],
      streams: [],
      tournaments: [],
      streamers: [],
    };
  }

  return Promise.all([
    prisma.product.findMany({
      where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { category: { contains: query, mode: "insensitive" } }] },
      take: 6,
    }),
    prisma.stream.findMany({
      where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { game: { contains: query, mode: "insensitive" } }] },
      take: 6,
      include: { streamer: { select: { name: true } } },
    }),
    prisma.tournament.findMany({
      where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { game: { contains: query, mode: "insensitive" } }] },
      take: 6,
    }),
    prisma.user.findMany({
      where: {
        role: UserRole.STREAMER,
        OR: [{ name: { contains: query, mode: "insensitive" } }, { bio: { contains: query, mode: "insensitive" } }],
      },
      take: 6,
    }),
  ]).then(([products, streams, tournaments, streamers]) => ({
    products,
    streams,
    tournaments,
    streamers,
  }));
}
