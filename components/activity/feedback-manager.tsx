"use client";

import { useState, useTransition } from "react";
import { Trash2, Lock, Globe } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { deleteFeedback, updateFeedbackVisibility } from "@/features/activity/actions";
import { formatRelativeTime } from "@/features/activity/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Feedback } from "@/features/activity/types";

type FeedbackManagerProps = {
  feedbacks: Feedback[];
};

export function FeedbackManager({ feedbacks }: FeedbackManagerProps) {
  const [items, setItems] = useState(feedbacks);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="rounded-[1.25rem] border border-border/70 bg-card/50 p-8 text-center">
        <p className="text-muted-foreground">
          You haven't shared any feedback yet. Help other students by sharing your UniDrop experience!
        </p>
      </div>
    );
  }

  const handleToggleVisibility = (feedbackId: string, currentIsPublic: boolean) => {
    startTransition(async () => {
      const result = await updateFeedbackVisibility(feedbackId, !currentIsPublic);

      if (result.status === "success") {
        setItems((prev) =>
          prev.map((item) =>
            item.id === feedbackId
              ? { ...item, is_public: !currentIsPublic }
              : item
          )
        );
        addToast(
          `Feedback is now ${!currentIsPublic ? "public" : "private"}`,
          "success",
          2000
        );
      } else {
        addToast(result.message, "error", 3000);
      }
    });
  };

  const handleDelete = (feedbackId: string) => {
    startTransition(async () => {
      const result = await deleteFeedback(feedbackId);

      if (result.status === "success") {
        setItems((prev) => prev.filter((item) => item.id !== feedbackId));
        addToast("Feedback deleted", "success", 2000);
      } else {
        addToast(result.message, "error", 3000);
      }
    });
  };

  return (
    <div className="space-y-3">
      {items.map((feedback) => (
        <Card key={feedback.id} className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-6 text-foreground">
                {feedback.feedback_text}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatRelativeTime(feedback.created_at)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => handleToggleVisibility(feedback.id, feedback.is_public)}
                disabled={isPending}
                className="rounded-lg p-2 transition hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed"
                title={feedback.is_public ? "Make private" : "Make public"}
              >
                {feedback.is_public ? (
                  <Globe className="size-4 text-primary" />
                ) : (
                  <Lock className="size-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => handleDelete(feedback.id)}
                disabled={isPending}
                className="rounded-lg p-2 transition hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete feedback"
              >
                <Trash2 className="size-4 text-destructive" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Status: {feedback.is_public ? "Public" : "Private"}
          </p>
        </Card>
      ))}
    </div>
  );
}
