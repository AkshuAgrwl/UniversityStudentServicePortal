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
  // people.csv
  const peopleData = await readCSV("people.csv");
  await prisma.$transaction(async (tx) => {
    for (const row of peopleData) {
      const data = {
        name: row.name,
        email: row.email,
        mobile_no: row.mobile_no,
        designation: row.designation as DesignationType,
      };
      await tx.people.upsert({
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
        staffIncharge:
          row.staff_incharge && row.staff_incharge.trim() !== "NULL"
            ? { connect: { id: row.staff_incharge } }
            : undefined,
        facultyIncharge:
          row.faculty_incharge && row.faculty_incharge.trim() !== "NULL"
            ? { connect: { id: row.faculty_incharge } }
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
