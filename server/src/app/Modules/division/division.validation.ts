import z from "zod";

export const divisonZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division Name must a string" })
    .min(3, { message: "Division Name to short. minimum 3 character long" })
    .max(50, { message: "Division Name to long" }),
  slug: z
    .string({ invalid_type_error: "Division Name must a string" })
    .min(3, { message: "Division Name to short. minimum 3 character long" })
    .max(50, { message: "Division Name to long" })
    .optional(),
  thumbnail: z.string().optional(),
  description: z
    .string({ invalid_type_error: "Description must a string" })
    .min(3, { message: "Description to short. minimum 30 character long" })
    .max(200, { message: "Description to long" })
    .optional(),
});
