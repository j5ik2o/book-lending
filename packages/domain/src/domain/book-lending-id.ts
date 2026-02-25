import type { ULID } from "ulid";

export class BookLendingId {
  constructor(readonly value: ULID) {}
}
