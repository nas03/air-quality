import { resMessage, statusCode } from "@/helpers/const";
import { createJWTToken, createResponse, validate, verifyJWTToken } from "@/helpers/utils/utils";
import { usersRepository } from "@/repositories";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { createUserSchema, signInSchema, signOutSchema } from "./schema/users.schema";

const createUser = async (req: Request, res: Response) => {
  try {
    const payload = await validate(createUserSchema, req.body);
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
    const data = await validate(signInSchema, req.body);
    if (!data) {
      return createResponse(res, statusCode.BAD_REQUEST, "error", resMessage.field_invalid, null);
    }

    const user = await usersRepository.getUser(String(data[data.type]), data.type);
    if (!user) return createResponse(res, statusCode.BAD_REQUEST, "error", resMessage.user_not_exists, null);

    const validatePassword = await bcrypt.compare(data.password, String(user?.password));
    if (!validatePassword) {
      return createResponse(res, statusCode.BAD_REQUEST, "error", resMessage.wrong_credentials, null);
    }

    const access_token = createJWTToken({ user_id: user.user_id }, "15m");
    const refresh_token = createJWTToken({ user_id: user.user_id }, "30d");
    return createResponse(res, statusCode.SUCCESS, "success", null, { access_token, refresh_token });
  } catch (error) {
    console.log("Error sign in user", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    const data = await validate(signOutSchema, req.body);
    if (!data) return createResponse(res, statusCode.BAD_REQUEST, "fail", resMessage.field_invalid);
    const verify = verifyJWTToken(data.user_id, data.access_token);
    if (!verify) return createResponse(res, statusCode.UNAUTHORIZED, "fail", resMessage.token_invalid);
    return createResponse(res, statusCode.SUCCESS, "success", null, null);
  } catch (error) {
    console.log("Error signing out user", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};
export { createUser, signIn, signOut };
