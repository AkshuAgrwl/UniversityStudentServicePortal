import { z } from "zod";

const dateOnly = z
  .date()
  .transform(
    (d) =>
      new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
  );

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
