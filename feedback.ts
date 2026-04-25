import { z } from "zod";

export const FEEDBACK_CATEGORIES = [
  "Bug Report",
  "Feature Request",
  "User Interface",
  "Performance",
  "Appreciation",
  "Other",
] as const;

export const FEEDBACK_STATUSES = ["new", "in_progress", "resolved", "archived"] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const STATUS_LABEL: Record<FeedbackStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
  archived: "Archived",
};

export const STATUS_STYLES: Record<FeedbackStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
};

export const CATEGORY_STYLES: Record<string, string> = {
  "Bug Report": "bg-rose-50 text-rose-700",
  "Feature Request": "bg-purple-50 text-purple-700",
  "User Interface": "bg-blue-50 text-blue-700",
  Performance: "bg-amber-50 text-amber-700",
  Appreciation: "bg-emerald-50 text-emerald-700",
  Other: "bg-slate-100 text-slate-700",
};

export const feedbackSchema = z
  .object({
    isAnonymous: z.boolean(),
    name: z.string().trim().max(200, "Name too long").optional().or(z.literal("")),
    email: z
      .string()
      .trim()
      .max(320, "Email too long")
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    rating: z.number().int().min(1, "Please give a rating").max(5),
    category: z.enum(FEEDBACK_CATEGORIES),
    message: z
      .string()
      .trim()
      .min(10, "Please write at least 10 characters")
      .max(5000, "Message too long (max 5000 chars)"),
  })
  .refine((data) => data.isAnonymous || (data.name && data.name.length > 0), {
    message: "Name is required (or check 'Submit anonymously')",
    path: ["name"],
  })
  .refine((data) => data.isAnonymous || (data.email && data.email.length > 0), {
    message: "Email is required (or check 'Submit anonymously')",
    path: ["email"],
  });

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(320),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const signupSchema = loginSchema.extend({
  displayName: z.string().trim().min(1, "Required").max(100),
});

export interface FeedbackRow {
  id: string;
  name: string | null;
  email: string | null;
  is_anonymous: boolean;
  rating: number;
  category: string;
  message: string;
  image_urls: string[];
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

export interface ReplyRow {
  id: string;
  feedback_id: string;
  admin_id: string;
  message: string;
  created_at: string;
}
