import type { ULID } from "ulid";

/** 書籍予約集約のID（ULID）。 */
export class BookReservationId {
  constructor(readonly value: ULID) {}
}
