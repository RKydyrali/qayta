import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    const eventType = payload.type as string;

    if (eventType === "user.created") {
      const data = payload.data;
      await ctx.runMutation(internal.users.createFromClerk, {
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        phone: data.phone_numbers?.[0]?.phone_number,
      });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }),
});

http.route({
  path: "/webhooks/stripe",
  method: "POST",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }),
});

http.route({
  path: "/webhooks/kaspi",
  method: "POST",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }),
});

export default http;
