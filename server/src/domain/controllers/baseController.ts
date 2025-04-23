export class BaseController<T extends unknown[]> {
	protected interactors: T;
	constructor(...interactors: T) {
		this.interactors = interactors;
	}
}
