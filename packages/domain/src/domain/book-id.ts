import { type ULID, isValid } from "ulid";
import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidAggregateIdError } from "./invalid-aggregate-id-error";

/** 書籍ID（ULID）。 */
export class BookId {
  private constructor(readonly value: ULID) {}

  /** ULIDから書籍IDを生成する。 */
  static create(value: ULID): BookId {
    return new BookId(value);
  }

  /** 文字列から書籍IDを生成する。不正なULID形式の場合は失敗を返す。 */
  static parseFromString(value: string): Result<BookId, InvalidAggregateIdError> {
    if (!isValid(value)) {
      return failure(new InvalidAggregateIdError("BookId", value));
    }
    return success(BookId.create(value as ULID));
  }
}
