export class MemberId {
  constructor(readonly value: string) {
    if (value.length === 0) {
      throw new Error("MemberId cannot be empty.");
    }
  }
}
