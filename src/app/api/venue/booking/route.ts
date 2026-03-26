import { auth } from "@/lib/auth";
import { prisma, TPrisma } from "@/lib/prismarc";

import { CreateBookingSchema } from "@/schemas/booking";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const reqData = await request.json();
    const body = CreateBookingSchema.parse(reqData);

    console.log(session?.user.id);

    const genData: TPrisma.BookingCreateInput = {
      issuer: { connect: { id: session?.user.id } },
      venue: { connect: { id: body.venue_id } },
      fromDate: body.from_date,
      toDate: body.to_date,
      fromTime: body.from_time,
      toTime: body.to_time,
      reason: body.reason,
    };

    if (body.accompanying_members && body.accompanying_members.length > 0) {
      genData.accompanyingMembers = {
        connectOrCreate: body.accompanying_members?.map((email: string) => ({
          where: { email: email },
          create: { email: email },
        })),
      };
    }

    console.log(body.from_date.toISOString());

    await prisma.booking.create({
      data: genData,
    });

    return Response.json({ message: "Booking created successfully" });
  } catch (e) {
    console.error("Error creating booking:", e);

    return Response.json(
      { message: "Failed to create booking" },
      { status: 500 },
    );
  }
}
