/** 既に返却済みの書籍を再度返却しようとした場合のエラー。 */
export class BookAlreadyReturnedException extends Error {
  constructor() {
    super("Book is already returned.");
    this.name = "BookAlreadyReturnedException";
  }
}
