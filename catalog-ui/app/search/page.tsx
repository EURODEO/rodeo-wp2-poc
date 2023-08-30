"use client";
import _ from "lodash";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DiscoveryMetadata, ElasticsearchRecord } from "../types";
import { useRouter } from "next/navigation";

type TimedResult<T> = {
  ts: number;
  loading: boolean;
  result: T;
};

type SelectedColumn = {
  name: string;
  path: string[];
  renderer?: (value: any) => JSX.Element;
};

export default function Page() {
  const [searchString, setSearchString] = useState("");
  const [searchRes, setSearchRes] = useState<
    TimedResult<ElasticsearchRecord<DiscoveryMetadata>[]>
  >({
    ts: 0,
    result: [],
    loading: false,
  });
  const router = useRouter();

  const selectedColumns: SelectedColumn[] = [
    {
      name: "ID",
      path: ["_id"],
    },
    {
      name: "Title",
      path: ["_source", "properties", "title"],
    },
    {
      name: "Description",
      path: ["_source", "properties", "title"],
    },
    {
      name: "Type",
      path: ["_source", "type"],
    },
  ];

  const debouncedSearch = useRef(
    _.debounce(async (criteria) => {
      console.log(criteria);
      const current = { ts: Date.now(), result: [], loading: true };
      setSearchRes(current);
      const res: ElasticsearchRecord<DiscoveryMetadata>[] = await fetch(
        "./quicksearch",
        {
          method: "POST",
          body: JSON.stringify({ criteria }),
        }
      ).then((r) => r.json());
      console.log(res);
      if (searchRes === current || current.ts > searchRes.ts)
        setSearchRes({
          ...current,
          result: res || [],
          loading: false,
        });
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    debouncedSearch("");
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    debouncedSearch(e.target.value);
  };

  const getThis = (
    el: { [key: string]: any },
    [head, ...tail]: string[]
  ): any => {
    if (tail.length === 0) {
      return el[head];
    }
    return getThis(el[head], tail);
  };

  console.log(searchRes);

  return (
    <div>
      <div>
        <input value={searchString} onChange={handleInputChange} />
      </div>
      <div>
        <table className="border-collapse border border-slate-500">
          <thead>
            <tr>
              {selectedColumns.map((el) => (
                <th key={`h${el.name}`} className="border border-slate-600">
                  {el.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searchRes.result.map((el) => {
              const results = selectedColumns.map((item) => ({
                value: item.renderer
                  ? item.renderer(getThis(el, item.path))
                  : getThis(el, item.path),
                key: item.name + el._id,
              }));

              return (
                <tr key={el._id} onClick={() => router.push(`/item/${el._id}`)}>
                  {results.map((a) => (
                    <td key={a.key} className="border border-slate-700">
                      {a.value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
