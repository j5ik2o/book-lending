import { type ULID, isValid } from "ulid";
import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidAggregateIdError } from "./invalid-aggregate-id-error";

/** 書籍予約集約のID（ULID）。 */
export class BookReservationId {
  private constructor(readonly value: ULID) {}

  /** ULIDから書籍予約IDを生成する。 */
  static create(value: ULID): BookReservationId {
    return new BookReservationId(value);
  }

  /** 文字列から書籍予約IDを生成する。不正なULID形式の場合は失敗を返す。 */
  static parseFromString(value: string): Result<BookReservationId, InvalidAggregateIdError> {
    if (!isValid(value)) {
      return failure(new InvalidAggregateIdError("BookReservationId", value));
    }
    return success(BookReservationId.create(value as ULID));
  }
}
