/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_mutations from "../admin/mutations.js";
import type * as admin_queries from "../admin/queries.js";
import type * as bio_actions from "../bio/actions.js";
import type * as bio_mutations from "../bio/mutations.js";
import type * as bio_queries from "../bio/queries.js";
import type * as consumers_mutations from "../consumers/mutations.js";
import type * as consumers_queries from "../consumers/queries.js";
import type * as crons from "../crons.js";
import type * as farm_actions from "../farm/actions.js";
import type * as farm_mutations from "../farm/mutations.js";
import type * as farm_queries from "../farm/queries.js";
import type * as http from "../http.js";
import type * as impact_mutations from "../impact/mutations.js";
import type * as impact_queries from "../impact/queries.js";
import type * as internal_auth from "../internal/auth.js";
import type * as internal_ecoPoints from "../internal/ecoPoints.js";
import type * as internal_geo from "../internal/geo.js";
import type * as internal_impact from "../internal/impact.js";
import type * as internal_partnerProfiles from "../internal/partnerProfiles.js";
import type * as internal_subscription from "../internal/subscription.js";
import type * as notifications_actions from "../notifications/actions.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as partners_mutations from "../partners/mutations.js";
import type * as partners_queries from "../partners/queries.js";
import type * as rescue_mutations from "../rescue/mutations.js";
import type * as rescue_orders_mutations from "../rescue/orders/mutations.js";
import type * as rescue_orders_queries from "../rescue/orders/queries.js";
import type * as rescue_queries from "../rescue/queries.js";
import type * as seeds_run from "../seeds/run.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/mutations": typeof admin_mutations;
  "admin/queries": typeof admin_queries;
  "bio/actions": typeof bio_actions;
  "bio/mutations": typeof bio_mutations;
  "bio/queries": typeof bio_queries;
  "consumers/mutations": typeof consumers_mutations;
  "consumers/queries": typeof consumers_queries;
  crons: typeof crons;
  "farm/actions": typeof farm_actions;
  "farm/mutations": typeof farm_mutations;
  "farm/queries": typeof farm_queries;
  http: typeof http;
  "impact/mutations": typeof impact_mutations;
  "impact/queries": typeof impact_queries;
  "internal/auth": typeof internal_auth;
  "internal/ecoPoints": typeof internal_ecoPoints;
  "internal/geo": typeof internal_geo;
  "internal/impact": typeof internal_impact;
  "internal/partnerProfiles": typeof internal_partnerProfiles;
  "internal/subscription": typeof internal_subscription;
  "notifications/actions": typeof notifications_actions;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  "partners/mutations": typeof partners_mutations;
  "partners/queries": typeof partners_queries;
  "rescue/mutations": typeof rescue_mutations;
  "rescue/orders/mutations": typeof rescue_orders_mutations;
  "rescue/orders/queries": typeof rescue_orders_queries;
  "rescue/queries": typeof rescue_queries;
  "seeds/run": typeof seeds_run;
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

export declare const components: {};
