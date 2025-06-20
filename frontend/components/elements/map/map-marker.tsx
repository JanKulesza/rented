import { Icon, LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";

const icon = new Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const MapMarker = ({ position }: { position: LatLngExpression }) => {
  return <Marker position={position} icon={icon} />;
};

export default MapMarker;
