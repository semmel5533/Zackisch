import { describe, expect, it } from "vitest";
import { newsletterResult } from "../lib/newsletter";

describe("newsletter response boundary", () => {
  it("distinguishes a pending confirmation from an existing subscription", () => {
    expect(newsletterResult(true, { success: true, status: "pending" })).toBe("pending");
    expect(newsletterResult(true, { success: true, status: "already_confirmed" })).toBe("already_confirmed");
  });

  it("keeps rejected responses out of the success state", () => {
    expect(newsletterResult(false, { success: true, status: "pending" })).toBe("error");
    expect(newsletterResult(true, { success: false, status: "pending" })).toBe("error");
    expect(newsletterResult(true, { success: "true", status: "pending" })).toBe("error");
  });

  it("accepts only explicit validation errors and never displays server messages", () => {
    expect(newsletterResult(true, { success: false, status: "invalid_email", message: "private diagnostic" })).toBe("invalid_email");
    for (const payload of [null, [], "ok", { success: true }, { success: true, status: "unknown" }, { message: "private diagnostic" }]) {
      expect(newsletterResult(true, payload)).toBe("error");
    }
  });
});
