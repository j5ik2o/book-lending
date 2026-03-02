import type { BookReservationId } from "./book-reservation-id";
import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { BookAlreadyCanceledException } from "./book-already-canceled-exception";
import type { BookId } from "./book-id";
import type { MemberId } from "./member-id";
import {BookLending} from "./book-lending";

type CreateBookReservationParams = Readonly<{
  id: BookReservationId;
  bookId: BookId;
  memberId: MemberId;
  cancelledAt?: Date;
  lent?: boolean;
}>;

export class BookReservation {
  private constructor(
    readonly id: BookReservationId,
    readonly bookId: BookId,
    readonly memberId: MemberId,
    readonly cancelledAt?: Date,
    private readonly _lent: boolean = false,
  ) {}

  static create(params: CreateBookReservationParams): BookReservation {
    return new BookReservation(params.id, params.bookId, params.memberId, params.cancelledAt, params.lent ?? false);
  }

  isCanceled(): boolean {
    return this.cancelledAt !== undefined;
  }

  cancel(): Result<BookReservation, BookAlreadyCanceledException> {
    if (this.cancelledAt !== undefined) {
      return failure(new BookAlreadyCanceledException());
    }
    return success(BookReservation.create({ ...this, cancelledAt: new Date() }));
  }

  isLent(): boolean {
    return this._lent;
  }

  lendBook(previousBookLending: BookLending): Result<[BookReservation, BookLending], Error> {
    const newReservation = BookReservation.create({ ...this, lent: true });
    const newBookLending = BookLending.create({
      id: previousBookLending.id,
      bookId: previousBookLending.bookId,
      memberId: previousBookLending.memberId,
      dueAtIso: previousBookLending.dueAtIso,
    });
    return success([newReservation, newBookLending]);
  }
}
