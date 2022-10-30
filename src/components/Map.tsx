// import React, { useEffect, useState } from "react";
import ReactMapGL from "react-map-gl";

export default function Map() {
  return (
    <ReactMapGL
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/saniaonline/cl9vmmrmq001415phxhjuhu9y"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    ></ReactMapGL>
  );
}
