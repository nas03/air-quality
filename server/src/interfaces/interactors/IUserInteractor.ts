import type { User } from "@/entities";

export interface IUserInteractor {
	createUser(input: Omit<User, "user+id">): Promise<User | null>;
	deleteUser(user_id: number): Promise<User | null>;
	findUser(identifier: unknown): Promise<User | null>;
	updateUser(
		user_id: number,
		payload: Partial<Omit<User, "user_id" | "role">>,
	): Promise<User | null>;
}
