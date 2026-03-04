/**
 * - 書籍を予約する（書籍予約集約が作られる）
 * - 予約した書籍をキャンセルする
 * - 予約した書籍を借りる
 */
import { describe, test } from "node:test";
import { expect } from "expect";
import { BookAlreadyCanceledError } from "./book-already-canceled-error";
import { BookAlreadyLentError } from "./book-already-lent-error";
import { BookNotReturnedError } from "./book-not-returned-error";
import { buildBookLending, buildBookLendingId, buildBookReservation, buildDueAt, buildReturnedBookLending } from "./test-fixtures";

describe("BookReservation", () => {
  test("createした予約は未キャンセルである", () => {
    const sut = buildBookReservation();
    expect(sut.isCanceled()).toBe(false);
  });

  describe("cancel", () => {
    test("未キャンセルの予約をキャンセルできる", () => {
      const sut = buildBookReservation();
      const newSut = sut.cancel().fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      expect(newSut.isCanceled()).toBe(true);
    });

    test("キャンセル済みの予約は再キャンセルできない", () => {
      const sut = buildBookReservation();
      const canceledSut = sut.cancel().fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      const result = canceledSut.cancel();
      expect(result.isFailure()).toBe(true);
      result.fold(
        () => {
          throw new Error("Expected failure.");
        },
        (failure) => {
          expect(failure).toBeInstanceOf(BookAlreadyCanceledError);
        },
      );
    });
  });

  describe("lendBook", () => {
    test("初回貸出（前回の貸出なし）であれば貸出できる", () => {
      const sut = buildBookReservation();
      const [newSut, bookLending] = sut.lendBook(buildBookLendingId(), buildDueAt()).fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      expect(newSut.isLent()).toBe(true);
      expect(bookLending.isReturned()).toBe(false);
    });

    test("前回の貸出が返却済みであれば貸出できる", () => {
      const sut = buildBookReservation();
      const previousBookLending = buildReturnedBookLending();
      const [newSut, bookLending] = sut.lendBook(buildBookLendingId(), buildDueAt(), previousBookLending).fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      expect(newSut.isLent()).toBe(true);
      expect(bookLending.isReturned()).toBe(false);
    });

    test("前回の貸出が未返却であれば貸出できない", () => {
      const sut = buildBookReservation();
      const previousBookLending = buildBookLending();
      const result = sut.lendBook(buildBookLendingId(), buildDueAt(), previousBookLending);
      expect(result.isFailure()).toBe(true);
      result.fold(
        () => {
          throw new Error("Expected failure.");
        },
        (failure) => {
          expect(failure).toBeInstanceOf(BookNotReturnedError);
        },
      );
    });

    test("既に貸出済みであれば再貸出できない", () => {
      const sut = buildBookReservation();
      const lentSut = sut.lendBook(buildBookLendingId(), buildDueAt()).fold(
        ([reservation]) => reservation,
        (failure) => {
          throw failure;
        },
      );
      const result = lentSut.lendBook(buildBookLendingId(), buildDueAt());
      expect(result.isFailure()).toBe(true);
      result.fold(
        () => {
          throw new Error("Expected failure.");
        },
        (failure) => {
          expect(failure).toBeInstanceOf(BookAlreadyLentError);
        },
      );
    });
  });
});
