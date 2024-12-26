import { BaseController } from '@/domain/controllers/baseController';
import { IUserInteractor } from '@/interfaces/interactors';
import { Request, Response } from 'express';

export class UserController extends BaseController<IUserInteractor> {
	onCreateUser = async (req: Request, res: Response) => {
		const body = req.body;
		const data = await this.interactor.createUser(body);
		return res.status(200).json({
			status: 'success',
			data: data,
		});
	};
}
