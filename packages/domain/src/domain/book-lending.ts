import type {ULID} from "ulid";

type CreateBookLendingParams = Readonly<{
  id: BookLendingId;
  bookId: string;
  memberId: string;
  dueAtIso: string;
}>;

export class BookLendingId {
    constructor(readonly value: ULID) {}
}

export class BookLending {
  private constructor(
    readonly id: BookLendingId,
    readonly bookId: string,
    readonly memberId: string,
    readonly dueAtIso: string,
    readonly returnedAtIso: string | null,
  ) {}

  static create(params: CreateBookLendingParams): BookLending {
    return new BookLending(params.id, params.bookId, params.memberId, params.dueAtIso, null);
  }

  isReturned(): boolean {
    return this.returnedAtIso !== null;
  }

  returnBook(returnedAtIso: string): BookLending {
    if (this.returnedAtIso !== null) {
      throw new Error("Book is already returned.");
    }

    return new BookLending(
      this.id,
      this.bookId,
      this.memberId,
      this.dueAtIso,
      returnedAtIso,
    );
  }
}
