/** 既に返却済みの書籍を再度返却しようとした場合のエラー。 */
export class BookAlreadyReturnedError extends Error {
  constructor() {
    super("Book is already returned.");
    this.name = "BookAlreadyReturnedError";
  }
}
