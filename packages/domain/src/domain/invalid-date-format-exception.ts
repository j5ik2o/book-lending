export class InvalidDateFormatException extends Error {
  constructor(readonly value: string) {
    super(`Invalid Date format: ${value}. Expected ISO format.`);
    this.name = "InvalidDateFormatException";
  }
}
