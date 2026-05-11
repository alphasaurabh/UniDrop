import { ActivityCard } from "@/components/activity/activity-card";
import { Card } from "@/components/ui/card";
import { getActivityFeed } from "@/features/activity/queries";
import { createClient } from "@/lib/supabase/server";

type ActivityFeedProps = {
  limit?: number;
  compact?: boolean;
};

export async function ActivityFeed({
  limit = 15,
  compact = false,
}: ActivityFeedProps) {
  const supabase = await createClient();
  const activities = await getActivityFeed(supabase, limit);

  if (activities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No activity yet. Start buying and selling to see campus activity here!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((item) => (
        <ActivityCard key={item.id} item={item} compact={compact} />
      ))}
    </div>
  );
}
