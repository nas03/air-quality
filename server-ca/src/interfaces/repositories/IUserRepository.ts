import { User } from '@/entities';

export interface IUserRepository {
	createUser(input: User): Promise<User | null>;
	updateUser(user_id: number): Promise<User | null>;
}
