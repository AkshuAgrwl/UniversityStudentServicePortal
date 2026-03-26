import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Prisma, PrismaClient } from "@/lib/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaPg({ connectionString });
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

export { prisma, Prisma as TPrisma };
