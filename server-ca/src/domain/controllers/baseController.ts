
export class BaseController<T> {
	protected interactor: T;
	constructor(interactor: T) {
		this.interactor = interactor;
	}
}
