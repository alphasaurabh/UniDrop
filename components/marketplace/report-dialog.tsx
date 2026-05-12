"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState, useTransition } from "react";
import { AlertCircle, Flag, X } from "lucide-react";

import { reportListing } from "@/features/marketplace/report-actions";
import { REPORT_REASONS, formatReportReasonLabel } from "@/features/marketplace/constants";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ReportDialogProps = {
  listingId: string;
  listingTitle: string;
};

type DialogState = "closed" | "open" | "submitting" | "success" | "error" | "duplicate";

export function ReportDialog({ listingId, listingTitle }: ReportDialogProps) {
  const [state, setState] = useState<DialogState>("closed");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleOpenDialog = () => {
    setState("open");
    setReason("");
    setDescription("");
    setErrorMessage("");
  };

  const handleCloseDialog = () => {
    setState("closed");
    setReason("");
    setDescription("");
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reason) {
      setErrorMessage("Please select a reason");
      return;
    }

    setState("submitting");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("listing_id", listingId);
      formData.set("reason", reason);
      if (description) {
        formData.set("description", description);
      }

      const result = await reportListing(null, formData);

      if (result.status === "success") {
        setState("success");
        setTimeout(() => handleCloseDialog(), 2000);
      } else if (result.status === "duplicate") {
        setState("duplicate");
        setErrorMessage(result.message);
      } else {
        setState("error");
        setErrorMessage(result.message);
      }
    });
  };

  return (
    <Fragment>
      {/* Trigger Button */}
      <Button
        onClick={handleOpenDialog}
        variant="outline"
        size="lg"
        className="w-full gap-2"
      >
        <Flag className="size-4" />
        Report
      </Button>

      {/* Dialog Backdrop */}
      <AnimatePresence>
        {state !== "closed" ? (
          <>
            <motion.div
              key="report-dialog-backdrop"
              className="fixed inset-0 z-50 bg-background/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              onClick={handleCloseDialog}
              aria-hidden="true"
            />

            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform p-4">
              <motion.div
                key="report-dialog-panel"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.985 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="surface-elevated overflow-hidden"
              >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold">Report listing</h2>
                <p className="text-sm text-muted-foreground">{listingTitle}</p>
              </div>
              <button
                onClick={handleCloseDialog}
                className="rounded-lg p-2 transition hover:bg-muted/70"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            {state === "success" ? (
              <div className="px-6 py-6">
                <div className="rounded-[1rem] border border-primary/15 bg-primary/10 p-4 text-center">
                  <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
                    <AlertCircle className="size-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">Thank you</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;ve received your report and will review it shortly.
                  </p>
                </div>
              </div>
            ) : state === "duplicate" ? (
              <div className="px-6 py-6">
                <div className="rounded-[1rem] border border-amber-500/15 bg-amber-500/10 p-4 text-center">
                  <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-amber-500/15 text-amber-400">
                    <AlertCircle className="size-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">Already reported</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You&apos;ve already reported this listing. We&apos;ll review your existing report.
                  </p>
                </div>
              </div>
            ) : state === "error" ? (
              <div className="px-6 py-6">
                <div className="rounded-[1rem] border border-destructive/15 bg-destructive/10 p-4 text-center">
                  <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-destructive/15 text-destructive">
                    <AlertCircle className="size-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">Error</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-6">
                <div className="space-y-4">
                  {/* Reason Select */}
                  <div className="space-y-2">
                    <label htmlFor="reason" className="text-sm font-medium">
                      Reason <span className="text-primary">*</span>
                    </label>
                    <Select
                      id="reason"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setErrorMessage("");
                      }}
                      disabled={isPending}
                      className={cn(
                        errorMessage && !reason && "border-destructive focus:border-destructive",
                      )}
                    >
                      <option value="">Select a reason...</option>
                      {REPORT_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {formatReportReasonLabel(r)}
                        </option>
                      ))}
                    </Select>
                    {errorMessage && !reason && (
                      <p className="text-xs text-destructive">{errorMessage}</p>
                    )}
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Additional details (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                      disabled={isPending}
                      placeholder="Provide more context about why you're reporting this listing..."
                      className="flex min-h-24 w-full rounded-xl border border-input/70 bg-background/80 px-3 py-2 text-sm shadow-soft placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {description.length}/1000 characters
                    </p>
                  </div>

                  {/* Error Message */}
                  {errorMessage && reason && (
                    <div className="rounded-[1rem] border border-destructive/15 bg-destructive/10 p-3 text-sm text-destructive">
                      {errorMessage}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    onClick={handleCloseDialog}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !reason}
                    className="flex-1"
                  >
                    {isPending ? "Submitting..." : "Submit report"}
                  </Button>
                </div>
              </form>
            )}
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </Fragment>
  );
}
