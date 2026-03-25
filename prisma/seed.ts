import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { prisma } from "@/lib/prismarc";

import { DesignationType, VenueType } from "@/lib/prisma/enums";

const DATA_DIR = path.resolve(import.meta.dirname, "../data");

async function readCSV(fileName: string) {
  const filePath = path.join(DATA_DIR, fileName);
  const file = fs.createReadStream(filePath, "utf-8");

  return new Promise<Record<string, string>[]>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      delimiter: "\t",
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error: any) => {
        reject(error);
      },
    });
  });
}

async function main() {
  // staff.csv
  const staffData = await readCSV("staff.csv");
  await prisma.$transaction(async (tx) => {
    for (const row of staffData) {
      const data = {
        name: row.name,
        email: row.email,
        mobile_no: row.mobile_no,
        designation: row.designation as DesignationType,
      };
      await tx.staff.upsert({
        where: { id: row.id },
        update: data,
        create: {
          id: row.id,
          ...data,
        },
      });
    }
  });

  // positions.csv
  const positionData = await readCSV("positions.csv");
  await prisma.$transaction(async (tx) => {
    for (const row of positionData) {
      const data = {
        role: row.role,
        email: row.email,
        person_in_position: {
          connect: { id: row.person_in_position },
        },
      };
      await tx.position.upsert({
        where: { id: row.id },
        update: data,
        create: {
          id: row.id,
          ...data,
        },
      });
    }
  });

  // venue.csv
  const venueData = await readCSV("venue.csv");
  await prisma.$transaction(async (tx) => {
    for (const row of venueData) {
      const data = {
        name: row.name,
        type: row.type as VenueType,
        availableForBooking:
          row.available_for_booking.trim().toLowerCase() === "true",
        lab_staff:
          row.lab_staff && row.lab_staff.trim() !== "NULL"
            ? { connect: { id: row.lab_staff } }
            : undefined,
        lab_incharge:
          row.lab_incharge && row.lab_incharge.trim() !== "NULL"
            ? { connect: { id: row.lab_incharge } }
            : undefined,
      };
      await tx.venue.upsert({
        where: { id: row.id },
        update: data,
        create: {
          id: row.id,
          ...data,
        },
      });
    }
  });
}

main()
  .then(async () => {
    console.log("Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("Error seeding the database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
