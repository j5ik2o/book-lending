import { Success } from "./success";
import { Failure } from "./failure";

export type Result<T, E> = Success<T, E> | Failure<T, E>;
