import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import issIconUrl from "/station_flat.png";

export default function ISSLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //Getting the ISS location
  useEffect(() => {
    let intervalId;
    async function getISSLocation() {
      setIsLoading(true);
      setError(null);
      try {
        const reponse = await axios.get(
          "http://api.open-notify.org/iss-now.json"
        );
        setLocation(reponse.data.iss_position);
        setError(null);
      } catch (error) {
        console.error("Error fetching ISS location : ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    getISSLocation(); //Initial fetch

    intervalId = setInterval(getISSLocation, 5000); //Get location after an interval

    return () => clearInterval(intervalId);
  }, []);
  const tileLayer = useMemo(
    () => (
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    ),
    []
  );
  //useMemo for the ISSMAP
  const ISSMap = useMemo(() => {
    if (
      !location ||
      isNaN(parseFloat(location.latitude)) ||
      isNaN(parseFloat(location.longitude))
    ) {
      return null;
    }
    try {
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid lat/lng from the API", location);
        return null;
      }

      const issIcon = L.icon({
        iconUrl: issIconUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
      });

      return (
        <MapContainer
          center={[lat, lng]}
          zoom={3}
          style={{ height: "700px", width: "100%" }}
        >
          {tileLayer}

          <Marker draggable={false} position={[lat, lng]} icon={issIcon}>
            <Popup>ISS Current Location</Popup>
          </Marker>
        </MapContainer>
      );
    } catch (iconError) {
      console.error("Error creating the icon", iconError);
      return null;
    }
  }, [location, tileLayer]);

  if (isLoading) {
    return <div>Loading ISS location...</div>;
  }

  if (error) {
    return (
      <div>
        Error: Could not retrieve ISS location. Please check your network
        connection or try again later. Error details: {error.message}
      </div>
    );
  }
  if (location) {
    try {
      return (
        <>
          <h2>ISS LOCATION</h2>
          {ISSMap}
          {location && (
            <div>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          )}
        </>
      );
    } catch (mapError) {
      console.error("Error with map rendering", mapError);
      return <div>Error rendering the map.</div>;
    }
  }
}
