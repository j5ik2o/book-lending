import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { BookAlreadyReturnedException } from "./book-already-returned-exception";
import type { BookId } from "./book-id";
import type { BookLendingId } from "./book-lending-id";
import type { DueAt } from "./due-at";
import type { MemberId } from "./member-id";
import type { ReturnedAt } from "./returned-at";

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

  returnBook(returnedAt: ReturnedAt): Result<BookLending, BookAlreadyReturnedException> {
    if (this.returnedAt !== undefined) {
      return failure(new BookAlreadyReturnedException());
    }

    return success(
      BookLending.create({
        ...this,
        returnedAt,
      }),
    );
  }
}
