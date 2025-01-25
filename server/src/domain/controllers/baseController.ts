export class BaseController<T extends any[]> {
  protected interactors: T;
  constructor(...interactors: T) {
    this.interactors = interactors;
  }
}

/*
class MyController extends BaseController<[AuthInteractor, UserInteractor]> {
  constructor(authInteractor: AuthInteractor, userInteractor: UserInteractor) {
    super(authInteractor, userInteractor);
  }

  someMethod() {
    // Access interactors using array index
    const [authInteractor, userInteractor] = this.interactors;
    // Use the interactors...
  }
}
*/
