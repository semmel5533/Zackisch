export const useRouter = () => ({ push() {}, refresh() {} });
export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const useQuery = () => undefined;
export const createCheckoutSessionAction = async () => {
  throw new Error("Payments are disabled in the marketing capture fixture");
};
export const updateOrderStatusAction = async () => {
  throw new Error("Mutations are disabled in the marketing capture fixture");
};
