/** 既に貸出済みの予約に対して再度貸出を行おうとした場合のエラー。 */
export class BookAlreadyLentError extends Error {
  constructor() {
    super("Book reservation is already lent.");
    this.name = "BookAlreadyLentError";
  }
}
