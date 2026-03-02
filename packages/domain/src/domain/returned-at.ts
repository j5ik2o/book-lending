import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidDateFormatError } from "./invalid-date-format-error";

/** 返却日時。不正な日付形式の場合は生成に失敗する。 */
export class ReturnedAt {
  private constructor(readonly value: Date) {}

  /** Dateから返却日時を生成する。 */
  static create(value: Date): ReturnedAt {
    return new ReturnedAt(value);
  }

  /** ISO 8601形式の文字列から返却日時を生成する。不正な形式の場合は失敗を返す。 */
  static parseFromString(value: string): Result<ReturnedAt, InvalidDateFormatError> {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return failure(new InvalidDateFormatError(value));
    }
    return success(ReturnedAt.create(new Date(parsed)));
  }
}
