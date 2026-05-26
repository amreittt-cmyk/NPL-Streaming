import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const productSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().optional().default(false),
  imageUrls: z.array(z.string().url()).min(1),
});

export const streamSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  game: z.string().min(2),
  category: z.string().min(2),
  thumbnailUrl: z.string().url(),
  streamUrl: z.string().url(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["LIVE", "SCHEDULED", "ENDED"]).default("SCHEDULED"),
  viewerCount: z.coerce.number().int().min(0).default(0),
  scheduledFor: z.string().optional().nullable(),
});

export const tournamentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  game: z.string().min(2),
  status: z.enum(["UPCOMING", "LIVE", "COMPLETED"]).default("UPCOMING"),
  coverImageUrl: z.string().url(),
  prizePool: z.string().min(2),
  location: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  bracket: z.any(),
  schedule: z.any(),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().optional().nullable(),
      name: z.string(),
      imageUrl: z.string().url(),
      price: z.number().min(0),
      quantity: z.number().int().min(1),
    }),
  ),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().min(0),
  couponCode: z.string().optional().nullable(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    address1: z.string().min(3),
    address2: z.string().optional(),
    city: z.string().min(2),
    country: z.string().min(2),
    postalCode: z.string().min(3),
  }),
});

export const registrationSchema = z.object({
  tournamentId: z.string(),
  teamName: z.string().min(2),
  contactEmail: z.string().email(),
  managerName: z.string().min(2),
  notes: z.string().optional(),
});
