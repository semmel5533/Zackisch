/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as audit from "../audit.js";
import type * as auth from "../auth.js";
import type * as authQueries from "../authQueries.js";
import type * as businesses from "../businesses.js";
import type * as checkoutPricing from "../checkoutPricing.js";
import type * as customAuth from "../customAuth.js";
import type * as emailLogs from "../emailLogs.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as menu from "../menu.js";
import type * as menuValidators from "../menuValidators.js";
import type * as merchantMedia from "../merchantMedia.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as partners from "../partners.js";
import type * as permissions from "../permissions.js";
import type * as seed from "../seed.js";
import type * as sessions from "../sessions.js";
import type * as setup from "../setup.js";
import type * as smartMenu from "../smartMenu.js";
import type * as storage from "../storage.js";
import type * as stripe from "../stripe.js";
import type * as support from "../support.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  audit: typeof audit;
  auth: typeof auth;
  authQueries: typeof authQueries;
  businesses: typeof businesses;
  checkoutPricing: typeof checkoutPricing;
  customAuth: typeof customAuth;
  emailLogs: typeof emailLogs;
  emails: typeof emails;
  http: typeof http;
  menu: typeof menu;
  menuValidators: typeof menuValidators;
  merchantMedia: typeof merchantMedia;
  newsletter: typeof newsletter;
  orders: typeof orders;
  partners: typeof partners;
  permissions: typeof permissions;
  seed: typeof seed;
  sessions: typeof sessions;
  setup: typeof setup;
  smartMenu: typeof smartMenu;
  storage: typeof storage;
  stripe: typeof stripe;
  support: typeof support;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  stripe: import("@convex-dev/stripe/_generated/component.js").ComponentApi<"stripe">;
};
