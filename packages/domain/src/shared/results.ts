import { Result } from "./result";
import { Success } from "./success";
import { Failure } from "./failure";

export const success = <T, E>(value: T): Result<T, E> => new Success(value);
export const failure = <T, E>(error: E): Result<T, E> => new Failure(error);
