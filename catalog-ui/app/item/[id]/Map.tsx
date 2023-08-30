"use client";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Geometry } from "@/app/types";
import { LatLngExpression } from "leaflet";
import "./Map.styles.css";

type MapProps = {
  geometry: Geometry;
};

export default function Map({ geometry }: MapProps) {
  console.log(geometry);

  const maxPoint = [
    geometry.coordinates[0][0][1],
    geometry.coordinates[0][0][0],
  ];
  const minPoint = [...maxPoint];

  const positions: LatLngExpression[][] = geometry.coordinates.map((e) =>
    e.map((f) => {
      if (f[1] > maxPoint[0]) maxPoint[0] = f[1];
      if (f[0] > maxPoint[1]) maxPoint[1] = f[0];
      if (f[1] < minPoint[0]) minPoint[0] = f[1];
      if (f[0] < minPoint[1]) minPoint[1] = f[0];
      return [f[1], f[0]];
    })
  );

  return (
    <MapContainer
      center={[
        (minPoint[0] + maxPoint[0]) / 2,
        (minPoint[1] + maxPoint[1]) / 2,
      ]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "100%", minHeight: 500 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        className="fill-cyan-500 stroke-cyan-500"
        positions={positions}
      />
    </MapContainer>
  );
}
