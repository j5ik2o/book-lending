import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidDateFormatException } from "./invalid-date-format-exception";
import { InvalidDueDateException } from "./invalid-due-date-exception";

export class DueAt {
  private constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new InvalidDateFormatException(value);
    }
  }

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
