import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidDateFormatException } from "./invalid-date-format-exception";
import { InvalidDueDateException } from "./invalid-due-date-exception";

/** 貸出期限（ISO 8601形式）。不正な日付形式の場合は生成に失敗する。 */
export class DueAt {
  private constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new InvalidDateFormatException(value);
    }
  }

  /** ISO 8601形式の文字列から貸出期限を生成する。不正な形式の場合は失敗を返す。 */
  static create(
    value: string,
  ): Result<DueAt, InvalidDateFormatException | InvalidDueDateException> {
    try {
      return success(new DueAt(value));
    } catch (ex: unknown) {
      if (ex instanceof InvalidDateFormatException || ex instanceof InvalidDueDateException) {
        return failure(ex);
      }
      throw ex;
    }
  }
}
