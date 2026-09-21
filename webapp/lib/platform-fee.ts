export const PLATFORM_FEE_RATE = 0.02;

/** Fee in cents for a server-validated order total in cents. */
export function platformFee(totalCents: number): number {
  return Math.round(totalCents * PLATFORM_FEE_RATE);
}
