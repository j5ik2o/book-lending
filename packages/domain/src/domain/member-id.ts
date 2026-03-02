/** 会員ID。空文字列は許可しない。 */
export class MemberId {
  constructor(readonly value: string) {
    if (value.length === 0) {
      throw new Error("MemberId cannot be empty.");
    }
  }
}
