import type { Success } from "./success";

export class Failure<T, E> {
  readonly tag = "failure";

  constructor(readonly error: E) {}

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return true;
  }

  fold<R>(_onSuccess: (value: T) => R, onFailure: (error: E) => R): R {
    return onFailure(this.error);
  }
}
