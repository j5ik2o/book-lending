/** 返却日時として不正な値が指定された場合のエラー。 */
export class InvalidReturnedAtException extends Error {
  constructor(readonly value: string) {
    super(`Invalid returned at: ${value}.`);
    this.name = "InvalidReturnedAtException";
  }
}
