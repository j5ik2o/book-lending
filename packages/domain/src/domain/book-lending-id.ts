import { type ULID, isValid } from "ulid";
import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidAggregateIdError } from "./invalid-aggregate-id-error";

/** 書籍貸出集約のID（ULID）。 */
export class BookLendingId {
  private constructor(readonly value: ULID) {}

  /** ULIDから書籍貸出IDを生成する。 */
  static create(value: ULID): BookLendingId {
    return new BookLendingId(value);
  }

  /** 文字列から書籍貸出IDを生成する。不正なULID形式の場合は失敗を返す。 */
  static parseFromString(value: string): Result<BookLendingId, InvalidAggregateIdError> {
    if (!isValid(value)) {
      return failure(new InvalidAggregateIdError("BookLendingId", value));
    }
    return success(BookLendingId.create(value as ULID));
  }
}
