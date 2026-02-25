import { Failure } from "./failure";

export class Success<T, E> {
  readonly tag = "success";

  constructor(readonly value: T) {}

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }
}
