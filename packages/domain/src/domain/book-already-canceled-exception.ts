export class BookAlreadyCanceledException extends Error {
  constructor() {
    super("Book reservation is already canceled.");
    this.name = "BookAlreadyCanceledException";
  }
}
