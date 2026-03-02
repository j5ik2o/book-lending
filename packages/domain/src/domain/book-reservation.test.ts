/**
 * - 書籍を予約する（書籍予約集約が作られる）
 * - 予約した書籍をキャンセルする
 * - 予約した書籍を借りる
 */
import { describe, test } from "node:test";
import { expect } from "expect";
import { BookAlreadyCanceledException } from "./book-already-canceled-exception";
import { buildBookReservation, buildReturnedBookLending } from "./test-fixtures";

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
    const previousBookLending = buildReturnedBookLending();
    const [newSut, bookLending] = sut.lendBook(previousBookLending).fold(
      (success) => success,
      (failure) => { throw failure; },
    );
    expect(newSut.isLent()).toBe(true);
    expect(bookLending.isReturned()).toBe(false);
  });
});
