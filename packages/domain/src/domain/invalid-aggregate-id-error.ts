/** 集約IDが不正な形式の場合のエラー。 */
export class InvalidAggregateIdError extends Error {
  constructor(
    readonly typeName: string,
    readonly value: string,
  ) {
    super(`Invalid ${typeName}: ${value}.`);
    this.name = "InvalidAggregateIdError";
  }
}
