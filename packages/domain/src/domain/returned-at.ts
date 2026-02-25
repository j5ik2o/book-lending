import { Result } from "../shared/result";
import { InvalidDateFormatException } from "./invalid-date-format-exception";
import { InvalidDueDateException } from "./invalid-due-date-exception";
import { failure, success } from "../shared/results";

export class ReturnedAt {
  private constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new Error("Invalid ReturnedAt format.");
    }
  }

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
