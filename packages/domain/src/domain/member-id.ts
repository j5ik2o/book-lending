import { type ULID, isValid } from "ulid";
import type { Result } from "../shared/result";
import { failure, success } from "../shared/results";
import { InvalidAggregateIdError } from "./invalid-aggregate-id-error";

/** 会員ID（ULID）。 */
export class MemberId {
  private constructor(readonly value: ULID) {}

  /** ULIDから会員IDを生成する。 */
  static create(value: ULID): MemberId {
    return new MemberId(value);
  }

  /** 文字列から会員IDを生成する。不正なULID形式の場合は失敗を返す。 */
  static parseFromString(value: string): Result<MemberId, InvalidAggregateIdError> {
    if (!isValid(value)) {
      return failure(new InvalidAggregateIdError("MemberId", value));
    }
    return success(MemberId.create(value as ULID));
  }
}
