import { describe, test } from "node:test";
import { expect } from "expect";
import type { ULID } from "ulid";
import { BookId } from "./book-id";
import { BookLending } from "./book-lending";
import { BookLendingId } from "./book-lending-id";
import { DueAt } from "./due-at";
import { MemberId } from "./member-id";
import { ReturnedAt } from "./returned-at";

const buildBookLending = (): BookLending => {
  const dueAtResult = DueAt.create("2030-01-01T00:00:00.000Z");
  if (dueAtResult.isFailure()) {
    throw dueAtResult.error;
  }

  return BookLending.create({
    id: new BookLendingId("01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID),
    bookId: new BookId("book-1"),
    memberId: new MemberId("member-1"),
    dueAtIso: dueAtResult.value,
  });
};

describe("BookLending", () => {
  test("createした貸出は未返却である", () => {
    const sut = buildBookLending();
    expect(sut.isReturned()).toBe(false);
  });

  test("returnBookで返却済みに遷移する", () => {
    const sut = buildBookLending();
    const returnedAtResult = ReturnedAt.create("2020-01-01T00:00:00.000Z");
    if (returnedAtResult.isFailure()) {
      throw returnedAtResult.error;
    }
    const returnedAt = returnedAtResult.value;
    const newSut = sut.returnBook(returnedAt);
    expect(newSut.isReturned()).toBe(true);
  });

  test.todo("返却済みの貸出をreturnBookすると例外になる");
  test("生成時に受け取った値が保持される", () => {
    const sut = buildBookLending();
    expect(sut.id.value).toBe("01HZZZZZZZZZZZZZZZZZZZZZZZ");
    expect(sut.bookId.value).toBe("book-1");
    expect(sut.memberId.value).toBe("member-1");
    expect(sut.dueAtIso.value).toBe("2030-01-01T00:00:00.000Z");
  });
});
