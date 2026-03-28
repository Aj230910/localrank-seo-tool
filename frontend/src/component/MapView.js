import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function MapView({ location }) {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      zoom={14}
      center={location}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      <Marker position={location} />
    </GoogleMap>
  );
}

export default MapView;