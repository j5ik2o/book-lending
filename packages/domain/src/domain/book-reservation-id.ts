import type { ULID } from "ulid";

export class BookReservationId {
  constructor(readonly value: ULID) {}
}
