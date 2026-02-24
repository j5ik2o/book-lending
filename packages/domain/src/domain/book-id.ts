export class BookId {
  constructor(readonly value: string) {
    if (value.length === 0) {
      throw new Error("BookId cannot be empty.");
    }
  }
}
