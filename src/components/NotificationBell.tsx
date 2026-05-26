import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "@phosphor-icons/react";

export function NotificationBell() {
  const { t, i18n } = useTranslation();
  const data = useQuery(api.notifications.queries.getMyNotifications, {
    limit: 10,
  });
  const markAllRead = useMutation(api.notifications.mutations.markAllRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = data?.unreadCount ?? 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="notification-bell"
        onClick={() => setOpen(!open)}
        aria-label={t("notifications.title")}
      >
        <Bell className="size-5" weight={unread > 0 ? "fill" : "regular"} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="notification-badge"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && data && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="card-qayta"
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              width: 280,
              zIndex: 100,
              maxHeight: 320,
              overflow: "auto",
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong>{t("notifications.title")}</strong>
              {unread > 0 && (
                <button
                  type="button"
                  className="btn-qayta"
                  style={{ padding: "2px 6px", fontSize: 11 }}
                  onClick={() => markAllRead()}
                >
                  {t("notifications.markAllRead")}
                </button>
              )}
            </div>
            {data.notifications.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--qayta-muted)" }}>
                {t("notifications.empty")}
              </p>
            ) : (
              data.notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--qayta-sand)",
                    opacity: n.isRead ? 0.6 : 1,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {i18n.language === "kk" ? n.titleKaz : n.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--qayta-muted)" }}>
                    {i18n.language === "kk" ? n.bodyKaz : n.body}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
