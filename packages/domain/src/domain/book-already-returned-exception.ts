export class BookAlreadyReturnedException extends Error {
  constructor() {
    super("Book is already returned.");
    this.name = "BookAlreadyReturnedException";
  }
}
