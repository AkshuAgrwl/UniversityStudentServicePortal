import { type NextRequest } from "next/server";

import { prisma, TPrisma } from "@/lib/prismarc";
import {
  toMySQLFullTextQuery,
  SEARCH_MAX_RAW_LENGTH,
  SEARCH_MAX_TOKEN_COUNT,
  tokenize,
} from "@/utils/search";
import { SAPIUsersSearchGETResponse } from "@/schemas/api/users/search";

const ALLOWED_SEARCH_BY_FIELDS = new Set<TPrisma.UserOrderByRelevanceFieldEnum>(
  ["name", "email"],
);

function isValidSearchByField(
  field: string,
): field is TPrisma.UserOrderByRelevanceFieldEnum {
  return ALLOWED_SEARCH_BY_FIELDS.has(
    field as TPrisma.UserOrderByRelevanceFieldEnum,
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search_by = searchParams.get("by");
    const query = decodeURIComponent(searchParams.get("query") || "");

    if (!search_by) {
      return Response.json(
        SAPIUsersSearchGETResponse.ERROR.BADREQUEST(
          "01",
          "Missing 'by' query parameter",
        ),
        { status: 400 },
      );
    }

    if (!query) {
      return Response.json(
        SAPIUsersSearchGETResponse.ERROR.BADREQUEST(
          "02",
          "Missing 'query' query parameter",
        ),
        { status: 400 },
      );
    }

    if (query.length > SEARCH_MAX_RAW_LENGTH) {
      return Response.json(
        SAPIUsersSearchGETResponse.ERROR.BADREQUEST(
          "03",
          "Query too long",
          `'query' must be ${SEARCH_MAX_RAW_LENGTH} characters or fewer.`,
        ),
        { status: 400 },
      );
    }

    const search_by_options = search_by
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (
      search_by_options.length === 0 ||
      !search_by_options.every(isValidSearchByField)
    ) {
      return Response.json(
        SAPIUsersSearchGETResponse.ERROR.BADREQUEST(
          "04",
          "Invalid 'by' query parameter",
          `'by' parameter must be one of ${Array.from(ALLOWED_SEARCH_BY_FIELDS).join(", ")}. If multiple, they should be comma separated.`,
        ),
        { status: 400 },
      );
    }

    const searchQuery = toMySQLFullTextQuery(query);
    if (!searchQuery) {
      return Response.json(SAPIUsersSearchGETResponse.SUCCESS([]), {
        status: 200,
      });
    }

    const tokens = tokenize(query);
    if (tokens.length > SEARCH_MAX_TOKEN_COUNT) {
      return Response.json(
        SAPIUsersSearchGETResponse.ERROR.BADREQUEST(
          "05",
          "Too many search terms",
          `Search may contain at most ${SEARCH_MAX_TOKEN_COUNT} terms.`,
        ),
        { status: 400 },
      );
    }

    const users = await prisma.user.findMany({
      take: 5,
      where:
        search_by_options.length === 1
          ? { [search_by_options[0]]: { search: searchQuery } }
          : {
              OR: search_by_options.map((field) => ({
                [field]: { search: searchQuery },
              })),
            },
      orderBy: {
        _relevance: {
          fields: search_by_options,
          search: searchQuery,
          sort: "desc",
        },
      },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    return Response.json(SAPIUsersSearchGETResponse.SUCCESS(users), {
      status: 200,
    });
  } catch (e) {
    return Response.json(SAPIUsersSearchGETResponse.ERROR.CRASH(e), {
      status: 500,
    });
  }
}
