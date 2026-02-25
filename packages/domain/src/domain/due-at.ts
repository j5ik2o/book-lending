import {Result} from "../shared/result";
import {failure, success} from "../shared/results";
import {InvalidDueAtFormatException} from "./invalid-due-at-format-exception";
import {InvalidDueDateException} from "./invalid-due-date-exception";

export class DueAt {
  private constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new InvalidDueAtFormatException(value);
    }
  }

  static create(value: string): Result<DueAt, InvalidDueAtFormatException | InvalidDueDateException> {
    try {
      return success(new DueAt(value));
    } catch (ex: unknown) {
      if (ex instanceof InvalidDueAtFormatException || ex instanceof InvalidDueDateException) {
        return failure(ex);
      }
      throw ex;
    }
  }
}
