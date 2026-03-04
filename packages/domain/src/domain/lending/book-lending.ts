import type { Result } from "../../shared/result";
import { failure, success } from "../../shared/results";
import { BookAlreadyReturnedError } from "./book-already-returned-error";
import type { BookId } from "../book-id";
import type { BookLendingId } from "./book-lending-id";
import { DueAt } from "./due-at";
import type { MemberId } from "../member-id";
import type { ReturnedAt } from "./returned-at";

type CreateBookLendingParams = Readonly<{
  id: BookLendingId;
  bookId: BookId;
  memberId: MemberId;
  dueAtIso: DueAt;
  returnedAt?: ReturnedAt;
}>;

/**
 * 書籍貸出集約。
 *
 * 書籍の貸出と返却を管理する。返却済みの貸出を再度返却することはできない。
 */
export class BookLending {
  private constructor(
    readonly id: BookLendingId,
    readonly bookId: BookId,
    readonly memberId: MemberId,
    readonly dueAtIso: DueAt,
    readonly returnedAt: ReturnedAt | undefined,
  ) {}

  /** 書籍貸出を生成する。 */
  static create(params: CreateBookLendingParams): BookLending {
    return new BookLending(
      params.id,
      params.bookId,
      params.memberId,
      params.dueAtIso,
      params.returnedAt,
    );
  }

  /** 返却済みかどうかを返す。 */
  isReturned(): boolean {
    return this.returnedAt !== undefined;
  }

  /** 貸出期限を延長する（仮実装）。 */
  renewBookLending(now: Date, _hasReservation: boolean): Result<BookLending, Error> {
    const dueDate = this.dueAtIso.value;
    const baseDate = now <= dueDate ? now : dueDate;
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + 14);
    const newDueAt = DueAt.create(newDate);
    return success(BookLending.create({ ...this, dueAtIso: newDueAt }));
  }

  /** 書籍を返却する。既に返却済みの場合は失敗を返す。 */
  returnBook(returnedAt: ReturnedAt): Result<BookLending, BookAlreadyReturnedError> {
    if (this.returnedAt !== undefined) {
      return failure(new BookAlreadyReturnedError());
    }

    return success(
      BookLending.create({
        ...this,
        returnedAt,
      }),
    );
  }
}
