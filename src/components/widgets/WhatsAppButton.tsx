import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  const whatsappNumber = "+92 304 7057347"; // Replace with actual number
  const message = encodeURIComponent("Hello! I'm interested in DeltaPrime AI Solutions.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <Button
          variant="whatsapp"
          size="icon-lg"
          className="relative group"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full animate-pulse" />
          
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-3 py-2 bg-card text-card-foreground text-sm font-medium rounded-lg shadow-card opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us!
          </span>
        </Button>
      </a>
    </motion.div>
  );
}
