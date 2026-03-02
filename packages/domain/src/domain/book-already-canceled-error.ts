/** 既にキャンセル済みの予約を再度キャンセルしようとした場合のエラー。 */
export class BookAlreadyCanceledError extends Error {
  constructor() {
    super("Book reservation is already canceled.");
    this.name = "BookAlreadyCanceledError";
  }
}
