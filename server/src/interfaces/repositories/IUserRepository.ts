import { User } from "@/entities";

export type UserFindCriteria = Partial<Pick<User, "user_id" | "email" | "username">>;

export interface IUserRepository {
  createUser(input: User): Promise<User | null>;
  updateUser(
    user_id: number,
    payload: Partial<Omit<User, "role" | "user_id">>
  ): Promise<User | null>;
  findUser(input: UserFindCriteria): Promise<User | null>;
  deleteUser(user_id: number): Promise<Pick<User, "user_id"> | null>;
}
