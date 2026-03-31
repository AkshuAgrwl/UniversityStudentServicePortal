import { prisma } from "@/lib/prismarc";

import NewBookingFormComponent from "./form";

export default async function NewBookingPage() {
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true, type: true },
  });

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="w-full max-w-lg">
        <NewBookingFormComponent venues={venues} />
      </div>
    </div>
  );
}
