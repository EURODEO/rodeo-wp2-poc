import { DiscoveryMetadata, ElasticsearchRecord } from "@/app/types";
import { Client } from "@elastic/elasticsearch";
import { GetResponse } from "@elastic/elasticsearch/lib/api/types";
import dynamic from "next/dynamic";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

const Map = dynamic(() => import("@/app/item/[id]/Map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

type ContentMap<T> = {
  value: T;
  name: string;
  custom?: (value: T) => JSX.Element | string;
};

export default async function Page({ params }: { params: { id: string } }) {
  const document: GetResponse<DiscoveryMetadata> = await client.get({
    index: "wis2-discovery-metadata",
    id: params.id,
  });

  if (!document.found) return <p>Not Found with id: {params.id}</p>;

  const contentMap: ContentMap<any>[] = [
    {
      name: "Title",
      value: document._source?.properties.title,
    },
    { name: "Description", value: document._source?.properties.description },
    {
      name: "Conforms to",
      value: document._source?.conformsTo,
      custom: (el: string[]) => el.join(", "),
    },
    {
      name: "Created at",
      value: document._source?.properties.created,
      custom: (val) => new Date(val).toLocaleString(),
    },
    {
      name: "Updated at",
      value: document._source?.properties.updated,
      custom: (val) => new Date(val).toLocaleString(),
    },
    {
      name: "WMO data policy",
      value: document._source?.properties["wmo:dataPolicy"],
    },
    {
      name: "WMO topic hierarchy",
      value: document._source?.properties["wmo:topicHierarchy"],
    },
    {
      name: "Themes",
      value: document._source?.properties.themes,
      custom: (val) => (
        <div className="divide-y divide-zinc-500">
          {val.map((el: { concepts: { id: string }[]; scheme?: string }) => (
            <div className="p-1" key={el.concepts.map((e) => e.id).join("-")}>
              <div>
                Concepts:{" "}
                {el.concepts.map((e: { id: string }) => e.id).join(", ")}
              </div>
              {el.scheme && <div>Scheme: {el.scheme}</div>}
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Links",
      value: document._source?.links,
      custom: (val) => (
        <div className="divide-y divide-zinc-500">
          {val.map(
            (el: {
              href: string | undefined;
              title: any;
              type: any;
              rel: any;
            }) => (
              <div className="p-1" key={el.href}>
                <a
                  href={el.href}
                  className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
                >{`${el.title}, ${el.type} (${el.rel})`}</a>
              </div>
            )
          )}
        </div>
      ),
    },
  ];

  const content = contentMap.map((a) => (
    <tr key={a.name} className="even:bg-zinc-200 dark:even:bg-zinc-800">
      <td className="p-3 w-1/4">{a.name}</td>
      <td className="p-3">{a.custom ? a.custom(a.value) : a.value}</td>
    </tr>
  ));

  return (
    <div>
      <p>{params.id}</p>
      <table className="w-full">
        <tbody className="divide-y divide-zinc-500">{content}</tbody>
      </table>
      {document._source?.geometry && (
        <Map geometry={document._source.geometry} />
      )}
    </div>
  );
}
