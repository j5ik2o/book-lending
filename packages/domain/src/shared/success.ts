import type { Failure } from "./failure";

export class Success<T, E> {
  readonly tag = "success";

  constructor(private readonly value: T) {}

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }

  fold<R>(onSuccess: (value: T) => R, _onFailure: (error: E) => R): R {
    return onSuccess(this.value);
  }
}
