import { db } from '@/config/db';
import { User } from '@/entities';
import { IUserRepository } from '@/interfaces/repositories';

export class UserRepository implements IUserRepository {
	constructor() {}

	async createUser(data: User): Promise<User | null> {
		const query = await db
			.insertInto('users')
			.values(data)
			.returningAll()
			.executeTakeFirst();
		return query ?? null;
	}
	async updateUser(user_id: number): Promise<User | null> {
		throw new Error('Method is not implemented');
	}
}
