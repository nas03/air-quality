export class BaseController<T extends any[]> {
  protected interactors: T;
  constructor(...interactors: T) {
    this.interactors = interactors;
  }
}
