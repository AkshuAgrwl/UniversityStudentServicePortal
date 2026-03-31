import { z } from "zod";
import u from "@/schemas/utils";

export const CreateBookingSchema = z
  .object({
    venue_id: z.string(),
    date_range: z.object({
      from: u.dateOnly,
      to: u.dateOnly,
    }),
    from_time: u.timeString,
    to_time: u.timeString,
    accompanying_members: z.array(
      z.object({
        name: z.string().nullable(),
        email: z.email(),
        image: z.url().nullable(),
      }),
    ),
    reason: z.string().min(1).max(500),
  })
  .superRefine((d, ctx) => {
    if (d.date_range.from > d.date_range.to) {
      ctx.addIssue({
        code: "custom",
        message: "from_date must be same or before to_date",
        path: ["to_date"],
      });
    }
  })
  .transform((d) => {
    return {
      venue_id: d.venue_id,
      from_date: d.date_range.from,
      to_date: d.date_range.to,
      from_time: d.from_time,
      to_time: d.to_time,
      accompanying_members: d.accompanying_members.map((m) => m.email),
      reason: d.reason,
    };
  });

export type CreateBookingInput = z.input<typeof CreateBookingSchema>;
export type CreateBookingBody = z.infer<typeof CreateBookingSchema>;
