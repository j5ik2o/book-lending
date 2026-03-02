/** 貸出期限として不正な日付が指定された場合のエラー。 */
export class InvalidDueDateException extends Error {
  constructor(readonly value: string) {
    super(`Invalid due date: ${value}.`);
    this.name = "InvalidDueDateException";
  }
}
