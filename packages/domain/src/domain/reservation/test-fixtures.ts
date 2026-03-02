import type { ULID } from "ulid";
import { BookId } from "../book-id";
import { MemberId } from "../member-id";
import { buildBookLending, buildReturnedBookLending } from "../lending/test-fixtures";
import { BookReservation } from "./book-reservation";
import { BookReservationId } from "./book-reservation-id";

export { buildBookLending, buildReturnedBookLending } from "../lending/test-fixtures";

const buildBookId = (value: ULID = "01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID): BookId => {
  return BookId.create(value);
};

const buildMemberId = (value: ULID = "01HYYYYYYYYYYYYYYYYYYYYYYYY" as ULID): MemberId => {
  return MemberId.create(value);
};

export const buildBookReservationId = (value: ULID = "01HZZZZZZZZZZZZZZZZZZZZZZZ" as ULID): BookReservationId => {
  return BookReservationId.create(value);
};

export const buildBookReservation = (overrides?: Partial<{
  id: BookReservationId;
  bookId: BookId;
  memberId: MemberId;
}>): BookReservation => {
  return BookReservation.create({
    id: overrides?.id ?? buildBookReservationId(),
    bookId: overrides?.bookId ?? buildBookId(),
    memberId: overrides?.memberId ?? buildMemberId(),
  });
};
