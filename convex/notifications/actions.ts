import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const sendPushOrEmail = action({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    titleKaz: v.string(),
    body: v.string(),
    bodyKaz: v.string(),
    email: v.optional(v.string()),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.notifications.mutations.createNotification, {
      userId: args.userId,
      type: args.type,
      title: args.title,
      titleKaz: args.titleKaz,
      body: args.body,
      bodyKaz: args.bodyKaz,
      relatedId: args.relatedId,
    });

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && args.email) {
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
          subject: args.title,
          html: `<p>${args.body}</p>`,
        }),
      });
    }

    return { sent: true };
  },
});
