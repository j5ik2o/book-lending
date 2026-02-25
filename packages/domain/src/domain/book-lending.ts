import { BookId } from "./book-id";
import { MemberId } from "./member-id";
import { DueAt } from "./due-at";
import { ReturnedAt } from "./returned-at";
import { BookLendingId } from "./book-lending-id";

type CreateBookLendingParams = Readonly<{
  id: BookLendingId;
  bookId: BookId;
  memberId: MemberId;
  dueAtIso: DueAt;
  returnedAt?: ReturnedAt;
}>;

export class BookLending {
  private constructor(
    readonly id: BookLendingId,
    readonly bookId: BookId,
    readonly memberId: MemberId,
    readonly dueAtIso: DueAt,
    readonly returnedAt: ReturnedAt | undefined,
  ) {}

  static create(params: CreateBookLendingParams): BookLending {
    return new BookLending(
      params.id,
      params.bookId,
      params.memberId,
      params.dueAtIso,
      params.returnedAt,
    );
  }

  isReturned(): boolean {
    return this.returnedAt !== undefined;
  }

  returnBook(returnedAt: ReturnedAt): BookLending {
    if (this.returnedAt !== undefined) {
      throw new Error("Book is already returned.");
    }

    return BookLending.create({
      ...this,
      returnedAt,
    });
  }
}
