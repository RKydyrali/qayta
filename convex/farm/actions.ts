import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const sendSubscriptionConfirmation = action({
  args: {
    email: v.string(),
    farmName: v.string(),
    partnerName: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set, skipping email");
      return { sent: false };
    }

    const from = process.env.RESEND_FROM ?? "hello@qayta.eco";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.email,
        subject: "Qayta Farm — подписка активирована",
        html: `<p>${args.farmName}, подписка на отходы от ${args.partnerName} активирована.</p>`,
      }),
    });

    return { sent: true };
  },
});

export const subscribeFarmerStripe = action({
  args: {
    listingId: v.id("farmListings"),
    plan: v.union(v.literal("monthly"), v.literal("quarterly")),
  },
  handler: async (ctx, args) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId =
      args.plan === "monthly"
        ? process.env.STRIPE_PRICE_FARM_MONTHLY
        : process.env.STRIPE_PRICE_FARM_QUARTERLY;

    if (!stripeKey || !priceId) {
      throw new Error("Stripe not configured");
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/farmer/subscriptions?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/farmer/explore`,
      metadata: {
        listingId: args.listingId,
        plan: args.plan,
      },
    });

    return { checkoutUrl: session.url };
  },
});
