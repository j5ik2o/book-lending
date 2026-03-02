/** 日付文字列がISO 8601形式として不正な場合のエラー。 */
export class InvalidDateFormatException extends Error {
  constructor(readonly value: string) {
    super(`Invalid Date format: ${value}. Expected ISO format.`);
    this.name = "InvalidDateFormatException";
  }
}
