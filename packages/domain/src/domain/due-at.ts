import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidDateFormatError } from "./invalid-date-format-error";

/** 貸出期限。不正な日付形式の場合は生成に失敗する。 */
export class DueAt {
  private constructor(readonly value: Date) {}

  /** Dateから貸出期限を生成する。 */
  static create(value: Date): DueAt {
    return new DueAt(value);
  }

  /** ISO 8601形式の文字列から貸出期限を生成する。不正な形式の場合は失敗を返す。 */
  static parseFromString(value: string): Result<DueAt, InvalidDateFormatError> {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return failure(new InvalidDateFormatError(value));
    }
    return success(DueAt.create(new Date(parsed)));
  }
}
