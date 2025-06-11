"use client";
import { formatAddress } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import { toast } from "sonner";
import { AddressType } from "../app/listings/add-property-schema";

interface MapRecenterToProps {
  addr: AddressType;
  onRecenter?: (location?: { lat: number; lon: string }) => void;
}

const icon = new L.Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const MapRecenterTo = ({ addr, onRecenter }: MapRecenterToProps) => {
  const map = useMap();
  const [location, setLocation] = useState<L.LatLngExpression>(map.getCenter());

  const { address, city, country, state, zip } = addr;

  useEffect(() => {
    if (!address || !city || !country || !state || !zip) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/geocode?address=${formatAddress(addr)}`
        );

        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            map.flyTo([lat, lon]);
            onRecenter?.({ lat, lon });
            setLocation([lat, lon]);
            toast.success("Location set sucessfully");
          } else {
            onRecenter?.();
            toast.error("Location not found. Please try again.");
          }
        } else {
          toast.error("Failed to fetch location. Please try again later.");
          onRecenter?.();
        }
      } catch (error) {
        toast.error(
          "An error occurred while fetching the location. Please try again later"
        );
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [address, city, state, country, zip]);
  return <Marker position={location} icon={icon} />;
};

export default MapRecenterTo;
