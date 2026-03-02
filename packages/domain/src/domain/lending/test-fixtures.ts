import type { ULID } from "ulid";
import { BookId } from "../book-id";
import { MemberId } from "../member-id";
import { BookLending } from "./book-lending";
import { BookLendingId } from "./book-lending-id";
import { DueAt } from "./due-at";
import { ReturnedAt } from "./returned-at";

const unwrap = <T>(result: { fold: (s: (v: T) => T, f: (e: unknown) => T) => T }): T => {
  return result.fold(
    (s) => s,
    (f) => { throw f; },
  );
};

export const buildBookId = (value: ULID = "01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID): BookId => {
  return BookId.create(value);
};

export const buildMemberId = (value: ULID = "01HYYYYYYYYYYYYYYYYYYYYYYYY" as ULID): MemberId => {
  return MemberId.create(value);
};

export const buildBookLendingId = (value: ULID = "01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID): BookLendingId => {
  return BookLendingId.create(value);
};

export const buildDueAt = (value = "2030-01-01T00:00:00.000Z"): DueAt => {
  return unwrap(DueAt.parseFromString(value));
};

export const buildReturnedAt = (value = "2020-01-01T00:00:00.000Z"): ReturnedAt => {
  return unwrap(ReturnedAt.parseFromString(value));
};

export const buildBookLending = (overrides?: Partial<{
  id: BookLendingId;
  bookId: BookId;
  memberId: MemberId;
  dueAtIso: DueAt;
  returnedAt: ReturnedAt;
}>): BookLending => {
  return BookLending.create({
    id: overrides?.id ?? buildBookLendingId(),
    bookId: overrides?.bookId ?? buildBookId(),
    memberId: overrides?.memberId ?? buildMemberId(),
    dueAtIso: overrides?.dueAtIso ?? buildDueAt(),
    returnedAt: overrides?.returnedAt,
  });
};

export const buildReturnedBookLending = (overrides?: Partial<{
  id: BookLendingId;
  bookId: BookId;
  memberId: MemberId;
  dueAtIso: DueAt;
  returnedAt: ReturnedAt;
}>): BookLending => {
  return buildBookLending({
    returnedAt: buildReturnedAt(),
    ...overrides,
  });
};
