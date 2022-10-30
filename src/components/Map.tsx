import * as React from "react";
import { useState, useMemo } from "react";
import { Container, render } from "react-dom";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";

import ControlPanel from "./ControlPanel";
import Pin from "./Pin";

import CITIES from "../data/cities.json";

const TOKEN =
  "pk.eyJ1Ijoic2FuaWFvbmxpbmUiLCJhIjoiY2w5dm1qbXR6MHpmZjN2bXl5NTM0amFobCJ9.T8zMsiXPu6nZLTBWqwYg2A";

export default function App() {
  const [popupInfo, setPopupInfo] = useState(CITIES[0]);

  const pins = CITIES.map((city, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={city.longitude}
      latitude={city.latitude}
      anchor="bottom"
      onClick={(e) => {
        // If we let the click event propagates to the map, it will immediately close the popup
        // with `closeOnClick: true`
        e.originalEvent.stopPropagation();
        setPopupInfo(city);
      }}
    >
      <Pin />
    </Marker>
  ));

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(CITIES[0])}
          >
            <div>
              {popupInfo.city}, {popupInfo.state} |{" "}
              <a
                target="_new"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
              >
                Wikipedia
              </a>
            </div>
            <img width="100%" src={popupInfo.image} />
          </Popup>
        )}
      </Map>

      <ControlPanel />
    </>
  );
}

export function renderToDom(container: Container | null) {
  render(<App />, container);
}
