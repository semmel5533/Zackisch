import { describe, expect, it } from "vitest";
import { guestCheckoutPath, guestMenuPath } from "../lib/guest-paths";

describe("guest route context", () => {
  it("keeps the table query after the checkout route", () => {
    expect(guestCheckoutPath("venue", "dine-in", "12")).toBe(
      "/table/venue/checkout?table=12",
    );
    expect(guestMenuPath("venue", "dine-in", "12")).toBe(
      "/table/venue?table=12",
    );
  });
  it("never carries table context into pickup", () => {
    expect(guestCheckoutPath("venue", "takeaway", "12")).toBe(
      "/pickup/venue/checkout",
    );
  });
  it("encodes opaque IDs and query values", () => {
    expect(guestCheckoutPath("a/b", "dine-in", "1&x=2")).toBe(
      "/table/a%2Fb/checkout?table=1%26x%3D2",
    );
  });
});
