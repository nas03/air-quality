import z from "zod";

export const createUserSchema = z.object({ username: z.string(), password: z.string(), email: z.string() });

export const signInSchema = z
  .object({
    type: z.enum(["email", "username"]),
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string(),
  })
  .refine((data) => {
    if (data.type === "username" && !data.username) {
      return false;
    }
    if (data.type === "email" && !data.email) {
      return false;
    }
    return true;
  });

export const signOutSchema = z.object({ user_id: z.number(), access_token: z.string() });
