import z from "zod";

export const createToureZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Name must a string" })
    .min(3, { message: "Name to short. minimum 3 character long" })
    .max(50, { message: "Name to long" }),
  slug: z
    .string({ invalid_type_error: "Slug must a string" })
    .min(3, { message: "Slug to short. minimum 3 character long" })
    .max(50, { message: "Slug to long" })
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be string" })
    .min(30, { message: "description to short. minimum 3 character" })
    .max(200, { message: "description cannot exceed 500 characters." })
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be string" })
    .max(200, { message: "location cannot exceed 200 characters." })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "costFrom must be number" })
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  included: z
    .string({ invalid_type_error: "included must be string" })
    .optional(),
  excluded: z.string({ invalid_type_error: "excluded must be string" }).optional(),
  amenities: z
    .string({ invalid_type_error: "amenities must be string" })
    .optional(),
  tourPlan: z
    .string({ invalid_type_error: "tourPlan must be string" })
    .optional(),
  maxGuest: z
    .number({
      invalid_type_error: "maxGuest must be number",
    })
    .optional(),
  minAge: z
    .number({
      invalid_type_error: "minAge must be number",
    })
    .optional(),
  division: z.string({
    invalid_type_error: "division must be string",
    required_error: "Division is required.",
  }),
  tourType: z.string({
    invalid_type_error: "tourType must be string",
    required_error: "Tour Type is required.",
  }),
});

export const updateToureZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Name must a string" })
    .min(3, { message: "Name to short. minimum 3 character long" })
    .max(50, { message: "Name to long" })
    .optional(),
  slug: z
    .string({ invalid_type_error: "Slug must a string" })
    .min(3, { message: "Slug to short. minimum 3 character long" })
    .max(50, { message: "Slug to long" })
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be string" })
    .min(30, { message: "description to short. minimum 3 character" })
    .max(200, { message: "description cannot exceed 500 characters." })
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be string" })
    .max(200, { message: "location cannot exceed 200 characters." })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "costFrom must be number" })
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  included: z
    .string({ invalid_type_error: "included must be string" })
    .optional(),
  excluded: z.string({ invalid_type_error: "excluded must be string" }),
  amenities: z
    .string({ invalid_type_error: "amenities must be string" })
    .optional(),
  tourPlan: z
    .string({ invalid_type_error: "tourPlan must be string" })
    .optional(),
  maxGuest: z
    .number({
      invalid_type_error: "maxGuest must be number",
    })
    .optional(),
  minAge: z
    .number({
      invalid_type_error: "minAge must be number",
    })
    .optional(),
  division: z.string({
    invalid_type_error: "division must be string",
    required_error: "Division is required.",
  }),
  tourType: z.string({
    invalid_type_error: "tourType must be string",
    required_error: "Tour Type is required.",
  }),
});
