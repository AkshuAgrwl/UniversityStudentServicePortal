import { z } from "zod";

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
  .refine((val) => !isNaN(Date.parse(val)), { error: "Invalid date" })
  .transform((val) => new Date(`${val}T00:00:00.000Z`));

const timeOnly = z
  .string()
  .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)")
  .transform((str) => {
    const [hours, minutes] = str.split(":").map(Number);
    return new Date(Date.UTC(1970, 0, 1, hours, minutes));
  });

const timeString = z
  .string()
  .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)")
  .transform((str) => {
    const [hours, minutes] = str.split(":").map(Number);
    return hours * 60 + minutes;
  });

export default { dateOnly, timeOnly, timeString };
