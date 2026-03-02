/**
 * - 書籍を予約する（書籍予約集約が作られる）
 * - 予約した書籍をキャンセルする
 * - 予約した書籍を借りる
 */
import { describe, test } from "node:test";
import { expect } from "expect";
import type { ULID } from "ulid";
import { BookAlreadyCanceledException } from "./book-already-canceled-exception";
import { BookId } from "./book-id";
import { BookLending } from "./book-lending";
import { BookLendingId } from "./book-lending-id";
import { BookReservation } from "./book-reservation";
import { BookReservationId } from "./book-reservation-id";
import { DueAt } from "./due-at";
import { MemberId } from "./member-id";
import { ReturnedAt } from "./returned-at";

const buildBookReservation = (): BookReservation => {
  return BookReservation.create({
    id: new BookReservationId("01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID),
    bookId: new BookId("book-1"),
    memberId: new MemberId("member-1"),
  });
};

describe("BookReservation", () => {
  test("createした予約は未キャンセルである", () => {
    const sut = buildBookReservation();
    expect(sut.isCanceled()).toBe(false);
  });

  test("未キャンセルの予約はキャンセル済みである", () => {
    const sut = buildBookReservation();
    const newSut = sut.cancel().fold(
      (success) => success,
      (failure) => {
        throw failure;
      },
    );
    expect(newSut.isCanceled()).toBe(true);
  });

  test("キャンセルした予約はキャンセルできない", () => {
    const sut = buildBookReservation();
    const newSut = sut.cancel().fold(
      (success) => success,
      (failure) => {
        throw failure;
      },
    );
    expect(newSut.isCanceled()).toBe(true);
    const result = newSut.cancel();
    expect(result.isFailure()).toBe(true);
    result.fold(
      () => {
        throw new Error("Expected failure.");
      },
      (failure) => {
        expect(failure).toBeInstanceOf(BookAlreadyCanceledException);
      },
    );
  });

  test("予約した書籍を借りる", () => {
    const sut = buildBookReservation();
    // 対象の書籍のpreviousBookLendingがisReturnedになっていることが前提
    const dueAt = DueAt.create("2030-01-01T00:00:00.000Z").fold(
      (s) => s,
      (f) => { throw f; },
    );
    const returnedAt = ReturnedAt.create("2020-01-01T00:00:00.000Z").fold(
      (s) => s,
      (f) => { throw f; },
    );
    const previousBookLending = BookLending.create({
      id: new BookLendingId("01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID),
      bookId: new BookId("book-1"),
      memberId: new MemberId("member-1"),
      dueAtIso: dueAt,
      returnedAt,
    });
    const [newSut, bookLending] = sut.lendBook(previousBookLending).fold(
      (success) => success,
      (failure) => { throw failure; },
    );
    expect(newSut.isLent()).toBe(true);
    expect(bookLending.isReturned()).toBe(false);
  });
});
