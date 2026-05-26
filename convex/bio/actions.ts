import { action } from "../_generated/server";
import { v } from "convex/values";

export const sendQuoteEmail = action({
  args: {
    email: v.string(),
    productName: v.string(),
    quoteKzt: v.number(),
  },
  handler: async (_ctx, args) => {
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
        subject: `Qayta Bio — коммерческое предложение: ${args.productName}`,
        html: `<p>Коммерческое предложение: ${args.quoteKzt.toLocaleString()} ₸</p>`,
      }),
    });

    return { sent: true };
  },
});
