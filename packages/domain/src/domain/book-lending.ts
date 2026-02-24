import {BookId} from "./book-id";
import {MemberId} from "./member-id";
import {DueAt} from "./due-at";
import {ReturnedAt} from "./returned-at";
import {BookLendingId} from "./book-lending-id";

type CreateBookLendingParams = Readonly<{
  id: BookLendingId;
  bookId: BookId;
  memberId: MemberId;
  dueAtIso: DueAt;
}>;

export class BookLending {
  private constructor(
    readonly id: BookLendingId,
    readonly bookId: BookId,
    readonly memberId: MemberId,
    readonly dueAtIso: DueAt,
    readonly returnedAtIso: ReturnedAt | undefined,
  ) {}

  static create(params: CreateBookLendingParams): BookLending {
    return new BookLending(params.id, params.bookId, params.memberId, params.dueAtIso, undefined);
  }

  isReturned(): boolean {
    return this.returnedAtIso !== undefined;
  }

  returnBook(returnedAtIso: ReturnedAt): BookLending {
    if (this.returnedAtIso !== undefined) {
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
