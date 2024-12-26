import { UserController } from '@/domain/controllers';
import { UserInteractor } from '@/domain/interactors';
import { catchAsync } from '@/domain/middlewares/catchAsync';
import { UserMiddleware } from '@/domain/middlewares/user.middleware';
import { UserRepository } from '@/domain/repositories';
import { Router } from 'express';

const userRepository = new UserRepository();
const userInteractor = new UserInteractor(userRepository);
const userController = new UserController(userInteractor);
const userMiddleware = new UserMiddleware();
const userRouter = Router();

userRouter.post(
	'/users',
	userMiddleware.validateUser,
	catchAsync(userController.onCreateUser.bind(userController))
);

export default userRouter;
