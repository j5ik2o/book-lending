import type { BookReservationId } from "./book-reservation-id";
import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { BookAlreadyCanceledError } from "./book-already-canceled-error";
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

  /** 予約した書籍を借りる。前回の貸出が返却済みであることが前提。 */
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
