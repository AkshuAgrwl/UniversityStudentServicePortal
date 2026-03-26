import { z } from "zod";
import u from "@/schemas/utils";

export const CreateBookingSchema = z
  .object({
    venue_id: z.string().min(1),
    from_date: u.dateOnly,
    to_date: u.dateOnly,
    from_time: u.timeString,
    to_time: u.timeString,
    accompanying_members: z.array(z.email()).optional(),
    reason: z.string().min(1).max(500),
  })
  .superRefine((d, ctx) => {
    if (d.from_date > d.to_date) {
      ctx.addIssue({
        code: "custom",
        message: "from_date must be same or before to_date",
        path: ["to_date"],
      });
    }
  });

export type CreateBookingBody = z.infer<typeof CreateBookingSchema>;
