import bcrypt from "bcryptjs";
import { PrismaClient, StreamStatus, TournamentStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.streamLike.deleteMany();
  await prisma.streamFollow.deleteMany();
  await prisma.vod.deleteMany();
  await prisma.stream.deleteMany();
  await prisma.tournamentRegistration.deleteMany();
  await prisma.tournamentTeam.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Aarav Rana",
      email: "admin@npllive.com",
      passwordHash,
      role: UserRole.ADMIN,
      emailVerified: true,
      bio: "Platform administrator for NPL Live.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const streamer = await prisma.user.create({
    data: {
      name: "Sanjog Khatri",
      email: "streamer@npllive.com",
      passwordHash,
      role: UserRole.STREAMER,
      emailVerified: true,
      bio: "NPL analyst, caster, and highlight creator.",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "Maya Shrestha",
      email: "viewer@npllive.com",
      passwordHash,
      role: UserRole.VIEWER,
      emailVerified: true,
      bio: "Long-time cricket fan and merch collector.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "NPL Lightning Jersey",
        slug: "npl-lightning-jersey",
        category: "jerseys",
        description: "Official match-day jersey with breathable mesh and neon crest.",
        price: 69.99,
        stock: 34,
        featured: true,
        imageUrls: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        ],
      },
    }),
    prisma.product.create({
      data: {
        name: "Kathmandu Nightfall Hoodie",
        slug: "kathmandu-nightfall-hoodie",
        category: "hoodies",
        description: "Heavyweight fleece hoodie inspired by the NPL opening night.",
        price: 84.99,
        stock: 18,
        featured: true,
        imageUrls: [
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
        ],
      },
    }),
    prisma.product.create({
      data: {
        name: "Caster RGB Keyboard",
        slug: "caster-rgb-keyboard",
        category: "keyboards",
        description: "Tournament-grade mechanical keyboard for fast scoring edits and live overlays.",
        price: 129.99,
        stock: 12,
        imageUrls: [
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
        ],
      },
    }),
    prisma.product.create({
      data: {
        name: "Boundary Rush Mouse",
        slug: "boundary-rush-mouse",
        category: "mouse",
        description: "Low-latency mouse with textured grip and customizable DPI profiles.",
        price: 49.99,
        stock: 26,
        imageUrls: [
          "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
        ],
      },
    }),
    prisma.product.create({
      data: {
        name: "Victory Call Headset",
        slug: "victory-call-headset",
        category: "headsets",
        description: "Immersive headset for streamers, commentators, and late-night scrims.",
        price: 99.99,
        stock: 20,
        featured: true,
        imageUrls: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        ],
      },
    }),
    prisma.product.create({
      data: {
        name: "NPL Supporter Pack",
        slug: "npl-supporter-pack",
        category: "accessories",
        description: "Sticker set, lanyard, enamel pin, and neon wristband bundle.",
        price: 24.99,
        stock: 50,
        imageUrls: [
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
        ],
      },
    }),
  ]);

  const liveStream = await prisma.stream.create({
    data: {
      title: "Janakpur Royals vs Pokhara Rhinos Live Watch Party",
      slug: "janakpur-royals-vs-pokhara-rhinos-watch-party",
      description: "Ball-by-ball commentary, stat overlays, and live audience predictions.",
      game: "Cricket",
      category: "Live Match",
      status: StreamStatus.LIVE,
      viewerCount: 19420,
      thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
      streamUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
      startedAt: new Date(),
      tags: ["live", "npl", "watch-party"],
      streamerId: streamer.id,
      vods: {
        create: [
          {
            title: "Super Over Recap",
            videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
            thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80",
            duration: "18:24",
            views: 4400,
          },
          {
            title: "Top 10 Boundaries",
            videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
            thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
            duration: "09:57",
            views: 6200,
          },
        ],
      },
      chatMessages: {
        create: [
          { body: "Pokhara are bowling a tighter line this over.", userId: viewer.id },
          { body: "That replay angle was unreal.", userId: admin.id },
        ],
      },
    },
  });

  await prisma.stream.createMany({
    data: [
      {
        title: "Draft Night Breakdown",
        slug: "draft-night-breakdown",
        description: "Team-by-team draft strategy and sleeper picks.",
        game: "Cricket",
        category: "Analysis",
        status: StreamStatus.SCHEDULED,
        viewerCount: 5200,
        thumbnailUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
        streamUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 5),
        tags: ["analysis", "draft", "teams"],
        streamerId: streamer.id,
      },
      {
        title: "Morning Nets Camera",
        slug: "morning-nets-camera",
        description: "Behind-the-scenes practice stream from the stadium.",
        game: "Cricket",
        category: "Behind the Scenes",
        status: StreamStatus.ENDED,
        viewerCount: 2100,
        thumbnailUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
        streamUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
        tags: ["practice", "behind-scenes"],
        streamerId: streamer.id,
      },
    ],
  });

  await prisma.streamFollow.create({
    data: {
      userId: viewer.id,
      streamId: liveStream.id,
    },
  });

  await prisma.streamLike.create({
    data: {
      userId: viewer.id,
      streamId: liveStream.id,
    },
  });

  const tournament = await prisma.tournament.create({
    data: {
      title: "NPL Championship Finals",
      slug: "npl-championship-finals",
      description: "The four best squads battle in a weekend finals bracket under the lights.",
      game: "Cricket",
      status: TournamentStatus.LIVE,
      coverImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
      prizePool: "$120,000",
      location: "TU International Cricket Ground",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      bracket: {
        rounds: [
          { name: "Semifinal 1", home: "Kathmandu Kings", away: "Lalitpur Tigers", winner: "Kathmandu Kings" },
          { name: "Semifinal 2", home: "Pokhara Rhinos", away: "Janakpur Royals", winner: "Pokhara Rhinos" },
          { name: "Final", home: "Kathmandu Kings", away: "Pokhara Rhinos", winner: null },
        ],
      },
      schedule: {
        matches: [
          { date: "2026-05-26", fixture: "Kathmandu Kings vs Pokhara Rhinos", time: "7:00 PM", status: "Live" },
          { date: "2026-05-27", fixture: "Awards Ceremony", time: "9:00 PM", status: "Upcoming" },
        ],
      },
      teams: {
        create: [
          { name: "Kathmandu Kings", logoUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=300&q=80", captain: "Ritvik Shah", region: "Kathmandu", wins: 6, losses: 2 },
          { name: "Pokhara Rhinos", logoUrl: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=300&q=80", captain: "Sagar Basnet", region: "Pokhara", wins: 5, losses: 3 },
        ],
      },
    },
  });

  await prisma.tournament.create({
    data: {
      title: "Rising Stars Combine",
      slug: "rising-stars-combine",
      description: "Youth showcase event for academy players and local fan voting.",
      game: "Cricket",
      status: TournamentStatus.UPCOMING,
      coverImageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
      prizePool: "$18,000",
      location: "Pokhara Stadium",
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
      bracket: { rounds: [] },
      schedule: {
        matches: [
          { date: "2026-06-02", fixture: "Academy All-Stars vs Province XI", time: "5:30 PM", status: "Upcoming" },
        ],
      },
    },
  });

  await prisma.tournamentRegistration.create({
    data: {
      tournamentId: tournament.id,
      userId: viewer.id,
      teamName: "Everest Challengers",
      contactEmail: "manager@everestchallengers.com",
      managerName: "Kabir Thapa",
      notes: "Need on-site warm-up slot confirmation.",
    },
  });

  await prisma.order.create({
    data: {
      userId: viewer.id,
      status: "PAID",
      paymentStatus: "paid",
      subtotal: 154.98,
      tax: 12.4,
      shipping: 9.99,
      total: 177.37,
      couponCode: "SAVE10",
      shippingAddress: {
        fullName: "Maya Shrestha",
        email: "viewer@npllive.com",
        address1: "Bhaktapur Durbar Square 18",
        city: "Bhaktapur",
        country: "Nepal",
        postalCode: "44800",
      },
      items: {
        create: [
          {
            name: products[0].name,
            imageUrl: products[0].imageUrls[0],
            price: products[0].price,
            quantity: 1,
            productId: products[0].id,
          },
          {
            name: products[5].name,
            imageUrl: products[5].imageUrls[0],
            price: products[5].price,
            quantity: 1,
            productId: products[5].id,
          },
        ],
      },
    },
  });

  await prisma.wishlistItem.createMany({
    data: [
      { userId: viewer.id, productId: products[1].id },
      { userId: viewer.id, productId: products[4].id },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin: admin@npllive.com / Password123!");
  console.log("Streamer: streamer@npllive.com / Password123!");
  console.log("Viewer: viewer@npllive.com / Password123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
