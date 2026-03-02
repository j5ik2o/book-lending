import { Result } from "../shared/result";
import { InvalidDateFormatException } from "./invalid-date-format-exception";
import { InvalidDueDateException } from "./invalid-due-date-exception";
import { failure, success } from "../shared/results";

/** 返却日時（ISO 8601形式）。不正な日付形式の場合は生成に失敗する。 */
export class ReturnedAt {
  private constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new Error("Invalid ReturnedAt format.");
    }
  }

  /** ISO 8601形式の文字列から返却日時を生成する。不正な形式の場合は失敗を返す。 */
  static create(
    value: string,
  ): Result<ReturnedAt, InvalidDateFormatException | InvalidDueDateException> {
    try {
      return success(new ReturnedAt(value));
    } catch (ex: unknown) {
      if (ex instanceof InvalidDateFormatException || ex instanceof InvalidDueDateException) {
        return failure(ex);
      }
      throw ex;
    }
  }
}
