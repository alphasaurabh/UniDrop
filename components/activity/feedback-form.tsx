"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/toast";
import { submitFeedback } from "@/features/activity/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackFormProps = {
  onSuccess?: () => void;
};

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const charCount = text.length;
  const isValid = charCount >= 10 && charCount <= 500;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      addToast("Feedback must be 10-500 characters", "error", 3000);
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("feedback_text", text);
      formData.set("is_public", String(isPublic));

      const result = await submitFeedback(formData);

      if (result.status === "success") {
        addToast(result.message, "success", 3000);
        setText("");
        setIsPublic(true);
        onSuccess?.();
      } else {
        addToast(result.message, "error", 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-[1.25rem] border border-border/70 bg-card/88 p-5 shadow-soft backdrop-blur-sm">
        <label className="block text-sm font-medium text-foreground mb-3">
          Share your UniDrop experience
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell other students about your experience buying or selling on UniDrop..."
          className={cn(
            "w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm",
            "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50",
            "resize-none"
          )}
          rows={4}
          disabled={isPending}
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className={cn(
            "text-xs",
            charCount < 10 && "text-destructive",
            charCount >= 10 && charCount <= 500 && "text-muted-foreground",
            charCount > 500 && "text-destructive"
          )}>
            {charCount}/500 characters
          </p>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isPending}
              className="size-4 rounded border border-border/50"
            />
            <span className="text-muted-foreground">Make public</span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full"
      >
        {isPending ? "Sharing..." : "Share feedback"}
      </Button>
    </form>
  );
}
