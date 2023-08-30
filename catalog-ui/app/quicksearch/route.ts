import { NextRequest, NextResponse } from "next/server";
import { Client } from "@elastic/elasticsearch";
import { DiscoveryMetadata } from "../types";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

export async function POST(request: NextRequest) {
  const data: { criteria: string } = await request.json();
  console.log(data);
  const res = await client.search({
    index: "wis2-discovery-metadata",
    query: {
      match_all: {},
      //match: { "properties._metadata-anytext": { query: data.criteria } },
    },
  });

  console.log(res);

  return NextResponse.json(
    res.hits.hits.filter((el) =>
      data.criteria
        .split(" ")
        .some((cr) =>
          (el._source as DiscoveryMetadata).properties["_metadata-anytext"]
            .toLocaleLowerCase()
            .includes(cr)
        )
    )
  );
}
