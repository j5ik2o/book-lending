/** 前回の貸出が未返却のまま新たな貸出を行おうとした場合のエラー。 */
export class BookNotReturnedError extends Error {
  constructor() {
    super("Previous book lending has not been returned.");
    this.name = "BookNotReturnedError";
  }
}
