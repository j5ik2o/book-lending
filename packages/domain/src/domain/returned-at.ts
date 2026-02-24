export class ReturnedAt {
  constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new Error("Invalid ReturnedAt format.");
    }
  }
}
