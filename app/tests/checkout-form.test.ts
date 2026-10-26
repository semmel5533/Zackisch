import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
const provider = vi.hoisted(() => ({
  state: { type: "loading" } as {
    type: string;
    error?: { message: string };
    checkout?: { canConfirm: boolean };
  },
}));
vi.mock("@stripe/react-stripe-js/checkout", () => ({
  PaymentElement: () => null,
  useCheckoutElements: () => provider.state,
}));
vi.mock("@/lib/i18n", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
import { CheckoutForm } from "../components/guest/checkout-form";
const render = () =>
  renderToStaticMarkup(createElement(CheckoutForm, { returnUrl: "/success" }));
describe("provider readiness", () => {
  it("keeps payment disabled and announces loading before the SDK is ready", () => {
    provider.state = { type: "loading" };
    expect(render()).toContain('role="status"');
    expect(render()).toContain('disabled=""');
  });
  it("shows a localized persistent failure without echoing provider initialization details", () => {
    provider.state = {
      type: "error",
      error: { message: "internal initialization detail" },
    };
    const html = render();
    expect(html).toContain('role="alert"');
    expect(html).toContain("paymentFailed");
    expect(html).not.toContain("internal initialization detail");
    expect(html).toContain('disabled=""');
  });
  it("requires the provider's canConfirm flag and retains the payment action label", () => {
    provider.state = { type: "success", checkout: { canConfirm: false } };
    expect(render()).toContain('disabled=""');
    provider.state = { type: "success", checkout: { canConfirm: true } };
    expect(render()).not.toContain('disabled=""');
    expect(render()).toContain("orderAndPay");
  });
});
