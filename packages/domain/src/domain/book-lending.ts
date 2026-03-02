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

  /** 書籍を返却する。既に返却済みの場合は失敗を返す。 */
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
