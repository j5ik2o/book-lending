import type { BookReservationId } from "./book-reservation-id";
import type { Result } from "../../shared/result";
import { failure, success } from "../../shared/results";
import { BookAlreadyCanceledError } from "./book-already-canceled-error";
import { BookNotReturnedError } from "./book-not-returned-error";
import type { BookId } from "../book-id";
import type { MemberId } from "../member-id";
import { BookLending } from "../lending/book-lending";
import type { BookLendingId } from "../lending/book-lending-id";
import type { DueAt } from "../lending/due-at";
import {BookAlreadyLentError} from "./book-already-lent-error";

type CreateBookReservationParams = Readonly<{
  id: BookReservationId;
  bookId: BookId;
  memberId: MemberId;
  cancelledAt?: Date;
  lent?: boolean;
}>;

/**
 * 書籍予約集約。
 *
 * 書籍の予約・キャンセル・貸出への遷移を管理する。
 */
export class BookReservation {
  private constructor(
    readonly id: BookReservationId,
    readonly bookId: BookId,
    readonly memberId: MemberId,
    readonly cancelledAt?: Date,
    private readonly _lent: boolean = false,
  ) {}

  /** 書籍予約を生成する。 */
  static create(params: CreateBookReservationParams): BookReservation {
    return new BookReservation(params.id, params.bookId, params.memberId, params.cancelledAt, params.lent ?? false);
  }

  /** キャンセル済みかどうかを返す。 */
  isCanceled(): boolean {
    return this.cancelledAt !== undefined;
  }

  /** 予約をキャンセルする。既にキャンセル済みの場合は失敗を返す。 */
  cancel(): Result<BookReservation, BookAlreadyCanceledError> {
    if (this.cancelledAt !== undefined) {
      return failure(new BookAlreadyCanceledError());
    }
    return success(BookReservation.create({ ...this, cancelledAt: new Date() }));
  }

  /** 貸出済みかどうかを返す。 */
  isLent(): boolean {
    return this._lent;
  }

  /** 予約した書籍を借りる。前回の貸出がある場合は返却済みであることが前提。 */
  lendBook(bookLendingId: BookLendingId, dueAt: DueAt, previousBookLending?: BookLending): Result<[BookReservation, BookLending], BookNotReturnedError> {
    if (this._lent) {
      return failure(new BookAlreadyLentError());
    }
    if (previousBookLending !== undefined && !previousBookLending.isReturned()) {
      return failure(new BookNotReturnedError());
    }
    const newReservation = BookReservation.create({ ...this, lent: true });
    const newBookLending = BookLending.create({
      id: bookLendingId,
      bookId: this.bookId,
      memberId: this.memberId,
      dueAtIso: dueAt,
    });
    return success([newReservation, newBookLending]);
  }
}
