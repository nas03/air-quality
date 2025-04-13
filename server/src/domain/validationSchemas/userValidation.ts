import z from "zod";

export const createUserSchema = {
    body: z.object({
        username: z.string(),
        password: z.string(),
        email: z.email(),
        phone_number: z.string(),
    }),
};

export const signInSchema = {
    body: z.object({
        accountIdentifier: z.string(),
        password: z.string(),
    }),
};
