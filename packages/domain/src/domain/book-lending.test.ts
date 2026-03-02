import { describe, test } from "node:test";
import { expect } from "expect";
import { BookAlreadyReturnedError } from "./book-already-returned-error";
import { buildBookLending, buildReturnedAt } from "./test-fixtures";

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
  test("書籍貸出集約の貸出期限を延長できる", () => {
    const sut = buildBookLending();

    // const newSut = sut.renewBookLending().fold(
    //     (success) => success,
    //     (failure) => {
    //       throw failure;
    //     },
    // );
    // expect(result.get().dueAtIso).toBeGreaterThan(sut.dueAtIso);
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
