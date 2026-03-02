import type { ULID } from "ulid";

/** 書籍貸出集約のID（ULID）。 */
export class BookLendingId {
  constructor(readonly value: ULID) {}
}
