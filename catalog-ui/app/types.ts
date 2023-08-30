export type ElasticsearchRecord<T> = {
  _id: string;
  _index: string;
  _score: number;
  _source: T;
};

export type Geometry = {
  type: "Polygon";
  coordinates: [number, number][][];
};

export type BasicLink = {
  rel: "collection" | "canonical" | "root" | "self" | "alternate";
};

export type DataLink = {
  channel: string;
  rel: "data";
};

export type Link = (BasicLink | DataLink) & {
  href: string;
  title: string;
  type: string;
};

export type DiscoveryMetadataProperties = {
  created: string;
  description: string;
  id: string;
  identifier: string;
  language: string;
  providers: {
    name: string;
    positionName: string;
    contactInfo: {
      address: {
        office: {
          adminstrativeArea: string;
          city: string;
          country: string;
          deliveryPoint: string;
          postalCode: string;
        };
      };
      contactInstruction: string;
      email: {
        office: string;
      };
      hoursOfService: string;
      phone: {
        office: string;
      };
      url: {
        rel: "canonical";
        type: string;
        href: string;
      };
    };
    roles: { name: string }[];
  }[];
  rights?: any;
  themes: {
    concepts: {
      id: string;
    }[];
    scheme?: string;
  }[];
  title: string;
  type: "dataset";
  updated: string;
  "wmo:dataPolicy": string;
  "wmo:topicHierarchy": string;
  "_metadata-anytext": string;
};

export type DiscoveryMetadata = {
  conformsTo: string[];
  geometry: Geometry;
  id: string;
  links: Link[];
  properties: DiscoveryMetadataProperties;
  time: {
    interval: (string | null)[];
    resolution: string;
  };
  type: "Feature";
};
