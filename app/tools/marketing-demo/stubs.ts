export const useRouter = () => ({ push() {}, refresh() {} });
export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const redirect = () => {};
export const notFound = () => {};
export const useQuery = () => undefined;
export const useMutation = () => async () => undefined;
export const useAction = () => async () => undefined;
const disabled = async () => ({ error: "fixtureActionDisabled" });
export const createCategoryAction = disabled;
export const updateCategoryAction = disabled;
export const deleteCategoryAction = disabled;
export const createMenuItemAction = disabled;
export const updateMenuItemAction = disabled;
export const deleteMenuItemAction = disabled;
export const toggleMenuItemAvailability = disabled;
export const toggleCustomizationAvailabilityAction = disabled;
export const reorderCategoriesAction = disabled;
export const reorderItemsAction = disabled;
export const updateBusinessAction = disabled;
export const requestAccountDeletionAction = disabled;
export const requestEmailChangeAction = disabled;
export const logoutAllDevicesAction = disabled;
export const toggleFeatureAction = disabled;
export const updateTablesAction = disabled;
export const connectStripeAction = disabled;
export const createStripeDashboardLinkAction = disabled;
export const completeTestStripeOnboardingAction = disabled;
export const createCheckoutSessionAction = async () => {
  throw new Error("Payments are disabled in the marketing capture fixture");
};
export const updateOrderStatusAction = async () => {
  throw new Error("Mutations are disabled in the marketing capture fixture");
};
export const exportOrdersCSVAction = async () => ({
  error: "fixtureActionDisabled",
});
export const signOutAction = disabled;
export const signOutStaffAction = disabled;
export const generateStaffSessionAction = disabled;
export const revalidatePath = () => {};


