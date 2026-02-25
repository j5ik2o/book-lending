export class InvalidReturnedAtException extends Error {
  constructor(readonly value: string) {
    super(`Invalid returned at: ${value}.`);
    this.name = "export class InvalidReturnedAtException extends Error {\n";
  }
}
