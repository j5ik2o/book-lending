export class DueAt {
  constructor(readonly value: string) {
    if (isNaN(Date.parse(value))) {
      throw new Error("Invalid DueAt format.");
    }
  }
}
