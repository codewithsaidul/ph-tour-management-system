import z from "zod";




export const createTourTypeZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must a string" })
        .min(3, { message: "Name to short. minimum 3 character long" })
        .max(50, { message: "Name to long" }),
})