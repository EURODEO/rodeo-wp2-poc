import { NextRequest, NextResponse } from "next/server";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

export async function POST(request: NextRequest) {
  const data: { criteria: string } = await request.json();
  console.log(data);
  const res = await client.search({
    index: "wis2-discovery-metadata",
    query: { match_all: {} },
  });

  console.log(res);

  return NextResponse.json(res.hits.hits);
}
