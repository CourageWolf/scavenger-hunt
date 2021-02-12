import {
  GoogleMap,
  InfoWindow,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Link, useHistory, useParams } from "react-router-dom";
import { AppContext } from "./ContextProvider";
import HuntListItem from "./HuntListItem";


const HuntsListPage = (props) => {
  // deconstruct huntList and setHuntList from context
  const { hunts, setHunts } = useContext(AppContext);

  let history = useHistory();
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    axios(`http://localhost:3000/api/hunts`)
      .then((res) => {
        setHunts(
          res.data.map((hunt) => {
            return {
              ...hunt,
              hunt_pos: {
                lat: hunt.hunt_lat,
                lng: hunt.hunt_long,
              },
            };
          })
        );
      })
      .catch((err) =>
        console.log("GET Error retrieving all hunts in the area")
      );
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.API_KEY,
  });

  const [map, setMap] = useState(null);

  const [center, setCenter] = useState({
    lat: 30.2674331,
    lng: -97.7419488,
  });

  const onMapLoad = useCallback((map) => {
    // Store a reference to the google map instance in state
    setMap(map);
  }, []);

  const onMapUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  const [infoWindow, setInfoWindow] = useState([]);

  const handleHuntItemClick = (pos, huntName) => {
    return setInfoWindow(
      // FIXME infoWindow doesn't open back up after being closed
      <InfoWindow
        position={{
          lat: pos.lat + 0.001,
          lng: pos.lng + 0.0,
        }}
      >
        <div className="huntMapInfo">
          <h4 className="huntMapInfoName">{huntName}</h4>
          {/* <div>{hunt.hunt_pplGoing} People Going!</div>
            <div>{hunt.hunt_votes} Total Votes!</div> */}
        </div>
      </InfoWindow>
    );
  };

  /* marker click links to that respective hunt page */
  const handleMarkerClick = (id, huntName) => {
    history.push(`/hunt/${id}`);
  };

  /**
   * searchBox enables the user to smart-search and refocus the map
   * the address input is stored in local state
   */
  const [searchBox, setSearchBox] = useState({});
  const onSearchLoad = (ref) => {
    setSearchBox(ref);
  };

  /**
   * searchBox handler that processes the selected address, deconstructs @lat / @lng values
   * and refocuses the map by updating the local @center state variable
   */
  const onPlacesChanged = () => {
    const address = searchBox.getPlaces()[0].formatted_address;
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCenter({ lat, lng });
      });
  };

  /**
   * @huntList contains each individual @HuntListItem component
   */
  const huntList = [];
  // loop and push to array a HuntListItem component
  // TODO switch back to hunts Context array
  hunts.forEach((huntObj) => {
    huntList.push(
      <HuntListItem
        className=""
        key={huntObj.hunt_id}
        huntId={huntObj.hunt_id}
        huntName={huntObj.hunt_name}
        voteCount={huntObj.hunt_votes}
        pos={huntObj.hunt_pos}
        linkTo={`/hunt/${huntObj.hunt_id}`}
        handleHuntItemClick={handleHuntItemClick}
      ></HuntListItem>
    );
  });

  return (
    <div className="huntListContainer">
      {/* <h1>Scavenger Hunts in Your Area!</h1> */}
      <div className="map-container">
      {isLoaded ? (
        <GoogleMap
          zoom={16}
          mapContainerStyle={{ height: "500px", width: "100%" }}
          center={center}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          disableDefaultUI={true}
        >
          {/* Load Markers */}
          {hunts.map((hunt) => {
            return (
              <Marker
                position={hunt.hunt_pos}
                onClick={() => handleMarkerClick(hunt.hunt_id, hunt.hunt_name)}
              />
            );
          })}
          {infoWindow}
          <StandaloneSearchBox
            onLoad={onSearchLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Where shall we leap to next?"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "relative",
                marginTop: "50px",
                left: "50%",
                marginLeft: "-120px",
              }}
            />
          </StandaloneSearchBox>
        </GoogleMap>
      ) : (
        <p>loading map...</p>
      )}
      {/* <div className="list-item-section">{huntList}</div> */}
      </div>
      <div className="container w-screen p-0 m-0 shadow-md overscroll-auto ">{huntList}</div>
      <Link
        to={{
          pathname: "/createhunt",
        }}
        className="btn btn-primary mr-2 w-100"
        type="button"
      >
        Create Hunt
      </Link>
    </div>
  );
};

export default HuntsListPage;
