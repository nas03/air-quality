import { User } from "@/entities";

export type UserIdUsername = Pick<User, "user_id" | "username">;
export type UserFindCriteria = Partial<Pick<User, "user_id" | "email" | "username">>;

export interface IUserRepository {
  createUser(input: User): Promise<UserIdUsername | null>;
  updateUser(user_id: number): Promise<Partial<User> | null>;
  findUser(input: UserFindCriteria): Promise<User | null>;
  deleteUser(user_id: number): Promise<Pick<User, "user_id"> | null>;
}
