import type { ULID } from "ulid";
import { BookId } from "./book-id";
import { BookLending } from "./book-lending";
import { BookLendingId } from "./book-lending-id";
import { BookReservation } from "./book-reservation";
import { BookReservationId } from "./book-reservation-id";
import { DueAt } from "./due-at";
import { MemberId } from "./member-id";
import { ReturnedAt } from "./returned-at";

export const buildDueAt = (value = "2030-01-01T00:00:00.000Z"): DueAt => {
  return DueAt.create(value).fold(
    (s) => s,
    (f) => { throw f; },
  );
};

export const buildReturnedAt = (value = "2020-01-01T00:00:00.000Z"): ReturnedAt => {
  return ReturnedAt.create(value).fold(
    (s) => s,
    (f) => { throw f; },
  );
};

export const buildBookLending = (overrides?: Partial<{
  id: BookLendingId;
  bookId: BookId;
  memberId: MemberId;
  dueAtIso: DueAt;
  returnedAt: ReturnedAt;
}>): BookLending => {
  return BookLending.create({
    id: overrides?.id ?? new BookLendingId("01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID),
    bookId: overrides?.bookId ?? new BookId("book-1"),
    memberId: overrides?.memberId ?? new MemberId("member-1"),
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

export const buildBookReservation = (overrides?: Partial<{
  id: BookReservationId;
  bookId: BookId;
  memberId: MemberId;
}>): BookReservation => {
  return BookReservation.create({
    id: overrides?.id ?? new BookReservationId("01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID),
    bookId: overrides?.bookId ?? new BookId("book-1"),
    memberId: overrides?.memberId ?? new MemberId("member-1"),
  });
};
