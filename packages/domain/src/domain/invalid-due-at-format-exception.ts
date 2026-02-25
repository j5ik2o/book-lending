export class InvalidDueAtFormatException extends Error {
  constructor(readonly value: string) {
    super(`Invalid DueAt format: ${value}. Expected ISO format.`);
    this.name = "InvalidDueAtFormatException";
  }
}
