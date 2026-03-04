import { describe, test } from "node:test";
import { expect } from "expect";
import { BookAlreadyReturnedError } from "./book-already-returned-error";
import { DueAt } from "./due-at";
import { buildBookLending, buildDueAt, buildReturnedAt } from "./test-fixtures";

describe("BookLending", () => {
  test("createした貸出は未返却である", () => {
    const sut = buildBookLending();
    expect(sut.isReturned()).toBe(false);
  });

  /**
   * - ユーザーは本の貸出期間延長ができる
   *   - 予約がない本に限り、1回のみ貸出期間を延長できる
   *   - 延長期間について
   *     - 元の返却日より前に延長手続きをした場合：延長手続きをした日から2週間
   *     - 元の返却日当日に延長手続きをした場合：延長手続きをした日から2週間（元の返却日から2週間）
   *     - 元の返却日を過ぎてから延長した場合：元の返却日から2週間
   */
  describe("renewBookLending", () => {
    test("元の返却日より前に延長した場合、手続き日から2週間になる", () => {
      // dueAt: 2030-01-01, now: 2029-12-25（返却日より前）
      const sut = buildBookLending();
      const now = new Date("2029-12-25T00:00:00.000Z");
      const hasReservation = false;
      const newSut = sut.renewBookLending(now, hasReservation).fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      const expected = DueAt.create(new Date("2030-01-08T00:00:00.000Z")); // 2029-12-25 + 2週間
      expect(newSut.dueAtIso.value.toISOString()).toBe(expected.value.toISOString());
    });

    test("元の返却日当日に延長した場合、手続き日から2週間になる", () => {
      // dueAt: 2030-01-01, now: 2030-01-01（返却日当日）
      const sut = buildBookLending();
      const now = new Date("2030-01-01T00:00:00.000Z");
      const hasReservation = false;
      const newSut = sut.renewBookLending(now, hasReservation).fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      const expected = DueAt.create(new Date("2030-01-15T00:00:00.000Z")); // 2030-01-01 + 2週間
      expect(newSut.dueAtIso.value.toISOString()).toBe(expected.value.toISOString());
    });

    test("元の返却日を過ぎてから延長した場合、元の返却日から2週間になる", () => {
      // dueAt: 2030-01-01, now: 2030-01-05（返却日を過ぎている）
      const sut = buildBookLending();
      const now = new Date("2030-01-05T00:00:00.000Z");
      const hasReservation = false;
      const newSut = sut.renewBookLending(now, hasReservation).fold(
        (success) => success,
        (failure) => {
          throw failure;
        },
      );
      const expected = DueAt.create(new Date("2030-01-15T00:00:00.000Z")); // 2030-01-01 + 2週間
      expect(newSut.dueAtIso.value.toISOString()).toBe(expected.value.toISOString());
    });
  });

  test("returnBookで返却済みに遷移する", () => {
    const sut = buildBookLending();
    const returnedAt = buildReturnedAt();
    const newSut = sut.returnBook(returnedAt).fold(
      (success) => success,
      (failure) => {
        throw failure;
      },
    );
    expect(newSut.isReturned()).toBe(true);
  });

  test("返却済みの貸出をreturnBookするとfailureになる", () => {
    const sut = buildBookLending();
    const returnedAt = buildReturnedAt();
    const returnedSut = sut.returnBook(returnedAt).fold(
      (success) => success,
      (failure) => {
        throw failure;
      },
    );
    const secondReturnResult = returnedSut.returnBook(returnedAt);
    expect(secondReturnResult.isFailure()).toBe(true);
    secondReturnResult.fold(
      () => {
        throw new Error("Expected failure.");
      },
      (failure) => {
        expect(failure).toBeInstanceOf(BookAlreadyReturnedError);
      },
    );
  });

  test("生成時に受け取った値が保持される", () => {
    const sut = buildBookLending();
    expect(sut.id.value).toBe("01HZZZZZZZZZZZZZZZZZZZZZZZ");
    expect(sut.bookId.value).toBe("01HZZZZZZZZZZZZZZZZZZZZZZZ");
    expect(sut.memberId.value).toBe("01HYYYYYYYYYYYYYYYYYYYYYYYY");
    expect(sut.dueAtIso.value.toISOString()).toBe("2030-01-01T00:00:00.000Z");
  });
});
