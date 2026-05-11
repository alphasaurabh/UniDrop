import type { ReportReason, ReportStatus } from "@/features/marketplace/constants";

export type Report = {
  id: string;
  listing_id: string;
  reporter_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
};

export type CreateReportInput = {
  listing_id: string;
  reason: ReportReason;
  description?: string;
};
