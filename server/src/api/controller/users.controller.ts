import { resMessage, statusCode } from "@/helpers/const";
import { createResponse, jwtToken, zodParse } from "@/helpers/utils/utils";
import { usersRepository } from "@/repositories";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import z from "zod";

const createUser = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
    });
    const payload = await zodParse(schema, req.body);
    if (!payload) {
      return createResponse(res, statusCode.BAD_REQUEST, "fail", resMessage.field_invalid, null);
    }
    const hashedPassword = await bcrypt.hash(payload.password, 16);
    const data = await usersRepository.createUser({ ...payload, password: hashedPassword });
    if (!data) {
      return createResponse(res, statusCode.ERROR, "error", resMessage.db_failed, null);
    }
    return createResponse(res, statusCode.SUCCESS, "success", null, data);
  } catch (error) {
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const schema = z
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
    const data = await zodParse(schema, req.body);
    if (!data) {
      return createResponse(res, statusCode.BAD_REQUEST, "error", resMessage.field_invalid, null);
    }
    const user = await usersRepository.getUser(String(data[data.type]), data.type);
    const validate = await bcrypt.compare(data.password, String(user?.password));
    if (!user || !validate) {
      return createResponse(res, statusCode.BAD_REQUEST, "error", resMessage.wrong_credentials, null);
    }
    const signInToken = jwtToken({ user_id: user.user_id });
    return createResponse(res, statusCode.SUCCESS, "success", null, signInToken);
  } catch (error) {
    console.log("Error sign in user", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};

export { createUser, signIn };
