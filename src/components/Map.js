import * as React from "react";
import { useState } from "react";
import { render } from "react-dom";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";

import NftPin from "./NftPin";
import NftDialog from "./NftDialog";
import NewNftForm from "./NewNftForm";

const TOKEN =
  "pk.eyJ1Ijoic2FuaWFvbmxpbmUiLCJhIjoiY2w5dm1qbXR6MHpmZjN2bXl5NTM0amFobCJ9.T8zMsiXPu6nZLTBWqwYg2A";

const defaultNftList = [
  {
    title: "New York",
    price: "8,175,133",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg",
    author: "New York",
    latitude: 40.6643,
    longitude: -73.9385,
  },
  {
    title: "Los Angeles",
    price: "3,792,621",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/5/57/LA_Skyline_Mountains2.jpg/240px-LA_Skyline_Mountains2.jpg",
    author: "California",
    latitude: 34.0194,
    longitude: -118.4108,
  },
  {
    title: "Chicago",
    price: "2,695,598",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2008-06-10_3000x1000_chicago_skyline.jpg/240px-2008-06-10_3000x1000_chicago_skyline.jpg",
    author: "Illinois",
    latitude: 41.8376,
    longitude: -87.6818,
  },
  {
    title: "Houston",
    price: "2,100,263",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Aerial_views_of_the_Houston%2C_Texas%2C_28005u.jpg/240px-Aerial_views_of_the_Houston%2C_Texas%2C_28005u.jpg",
    author: "Texas",
    latitude: 29.7805,
    longitude: -95.3863,
  },
];

export default function MapComponent() {
  const [nftList, setNftList] = useState(defaultNftList);
  const [popupInfo, setPopupInfo] = useState(null);
  const [newNftLocation, setNewNftLocation] = useState(null);

  const pins = nftList.map((nft, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={nft.longitude}
      latitude={nft.latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        console.log("TEST nft", nft);
        setPopupInfo(nft);
      }}
    >
      <NftPin image={nft.image} />
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
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          console.log(e);
          const selectedLocation = {
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          };
          setNewNftLocation(selectedLocation);
        }}
      >
        <GeolocateControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />
        <NavigationControl position="bottom-right" />

        {pins}

        {popupInfo && (
          <NftDialog nft={popupInfo} onClose={() => setPopupInfo(null)} />
        )}

        {newNftLocation && (
          <NewNftForm
            nftLocation={newNftLocation}
            setNftList={setNftList}
            onClose={() => setNewNftLocation(false)}
          />
        )}
      </Map>
    </>
  );
}

export function renderToDom(container) {
  render(<MapComponent />, container);
}
