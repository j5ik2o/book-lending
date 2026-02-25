import { describe, test } from "node:test";
import { expect } from "expect";
import type { ULID } from "ulid";
import { BookAlreadyReturnedException } from "./book-already-returned-exception";
import { BookId } from "./book-id";
import { BookLending } from "./book-lending";
import { BookLendingId } from "./book-lending-id";
import { DueAt } from "./due-at";
import { MemberId } from "./member-id";
import { ReturnedAt } from "./returned-at";

const buildDueAt = (): DueAt => {
  const dueAtResult = DueAt.create("2030-01-01T00:00:00.000Z");
  return dueAtResult.fold(
    (success) => success,
    (failure) => {
      throw failure;
    },
  );
};

const buildReturnedAt = (): ReturnedAt => {
  const returnedAtResult = ReturnedAt.create("2020-01-01T00:00:00.000Z");
  return returnedAtResult.fold(
    (success) => success,
    (failure) => {
      throw failure;
    },
  );
};

const buildBookLending = (): BookLending => {
  return BookLending.create({
    id: new BookLendingId("01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID),
    bookId: new BookId("book-1"),
    memberId: new MemberId("member-1"),
    dueAtIso: buildDueAt(),
  });
};

describe("BookLending", () => {
  test("createした貸出は未返却である", () => {
    const sut = buildBookLending();
    expect(sut.isReturned()).toBe(false);
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
        expect(failure).toBeInstanceOf(BookAlreadyReturnedException);
      },
    );
  });

  test("生成時に受け取った値が保持される", () => {
    const sut = buildBookLending();
    expect(sut.id.value).toBe("01HZZZZZZZZZZZZZZZZZZZZZZZ");
    expect(sut.bookId.value).toBe("book-1");
    expect(sut.memberId.value).toBe("member-1");
    expect(sut.dueAtIso.value).toBe("2030-01-01T00:00:00.000Z");
  });
});
