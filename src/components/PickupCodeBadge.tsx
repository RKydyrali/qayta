import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, CopySimple } from "@phosphor-icons/react";

export function PickupCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="inline-flex items-center gap-2"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Badge
        variant="outline"
        className="font-mono text-base px-3 py-1 border-qayta-earth text-qayta-earth"
      >
        {code}
      </Badge>
      <Button variant="ghost" size="icon-xs" onClick={copy}>
        {copied ? (
          <Check className="size-3 text-qayta-leaf" />
        ) : (
          <CopySimple className="size-3" />
        )}
      </Button>
    </motion.div>
  );
}
