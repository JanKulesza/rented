import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import MapRecenterTo, { LatLon } from "./map-recenter-to";
import { LatLngExpression } from "leaflet";
import { AddressType } from "../../app/listings/add-property/add-property-schema";
import MapMarker from "./map-marker";

interface MapPropsBase {
  startPosition: LatLngExpression;
  height?: string;
  width?: string;
  zoom?: number;
}

type MapProps =
  | (MapPropsBase & {
      useRecenter?: false;
      addr?: null;
      onRecenter?: null;
    })
  | (MapPropsBase & {
      useRecenter: true;
      addr: AddressType;
      onRecenter?: (location?: LatLon) => void;
    });

const Map = ({
  startPosition,
  useRecenter,
  addr,
  onRecenter,
  height,
  width,
  zoom,
}: MapProps) => {
  return (
    <MapContainer
      className="w-1/3 rounded-xl overflow-hidden"
      center={startPosition}
      zoom={zoom ?? 12}
      minZoom={5}
      scrollWheelZoom={true}
      zoomAnimation={true}
      zoomControl={false}
      style={{ height: height ?? "100%", width: width ?? "100%" }}
    >
      <ZoomControl position="topright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={20}
        attribution="© CartoDB"
      />
      {useRecenter ? (
        <MapRecenterTo addr={addr} onRecenter={onRecenter} />
      ) : (
        <MapMarker position={startPosition} />
      )}
    </MapContainer>
  );
};

export default Map;
