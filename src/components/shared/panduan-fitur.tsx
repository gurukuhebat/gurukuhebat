"use client";

import * as React from "react";
import { AlertCircle, X, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PanduanFiturProps {
  title: string;
  children: React.ReactNode;
}

export function PanduanFitur({ title, children }: PanduanFiturProps) {
  const pengaturan = useStore((s) => s.pengaturan);
  const setPengaturan = useStore((s) => s.setPengaturan);

  // Jika showTutorial tidak ada (undefined), anggap saja true.
  const isVisible = pengaturan.showTutorial !== false;

  const handleClose = () => {
    setPengaturan({ ...pengaturan, showTutorial: false });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Alert className="relative border-blue-200 bg-blue-50 text-blue-900 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100">
            <Lightbulb className="size-5 text-blue-600 dark:text-blue-400" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <AlertTitle className="text-blue-800 dark:text-blue-300 font-bold mb-1">
                  💡 Panduan: {title}
                </AlertTitle>
                <AlertDescription className="text-sm leading-relaxed opacity-90">
                  {children}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute right-2 top-2 h-6 w-6 text-blue-600 hover:bg-blue-200/50 dark:text-blue-400 dark:hover:bg-blue-900/50"
                title="Tutup Panduan (Bisa dibuka lagi di menu Pengaturan)"
              >
                <X className="size-4" />
                <span className="sr-only">Tutup</span>
              </Button>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
