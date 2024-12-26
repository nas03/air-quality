import { UserRepository } from '@/domain/repositories';
import { User } from '@/entities';
import { IUserInteractor } from '@/interfaces/interactors';

export class UserInteractor implements IUserInteractor {
	private userRepository: UserRepository;
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}
	async createUser(input: User): Promise<User | null> {
		const data = await this.userRepository.createUser(input);
		return data;
	}
	deleteUser(user_id: number): Promise<User | null> {
		throw new Error('Method is not implemented');
	}
}
