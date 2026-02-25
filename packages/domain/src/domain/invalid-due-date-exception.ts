export class InvalidDueDateException extends Error {
  constructor(readonly value: string) {
    super(`Invalid due date: ${value}.`);
    this.name = "InvalidDueDateException";
  }
}
