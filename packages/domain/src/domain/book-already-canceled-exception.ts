/** 既にキャンセル済みの予約を再度キャンセルしようとした場合のエラー。 */
export class BookAlreadyCanceledException extends Error {
  constructor() {
    super("Book reservation is already canceled.");
    this.name = "BookAlreadyCanceledException";
  }
}
