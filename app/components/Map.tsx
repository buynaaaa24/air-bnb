'use client';

import React from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon issue in Next.js / webpack environment
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  iconUrl: markerIcon.src || markerIcon,
  shadowUrl: markerShadow.src || markerShadow,
});

interface MapProps {
  center?: [number, number];
}

const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={center || [51, -0.09]}
      zoom={center ? 4 : 2}
      scrollWheelZoom={false}
      className="w-[960px]  h-[350px] overflow-hidden rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-700"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && <Marker position={center} />}
    </MapContainer>
  );
};

export default Map;
