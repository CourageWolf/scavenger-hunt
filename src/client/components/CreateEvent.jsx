import React, { useState, Fragment, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { AppContext } from "./ContextProvider";
import axios from "axios";
import PlacesAutocomplete from "react-places-autocomplete";

import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import LocationSearchInput from "./LocationSearchInput";
import { useController } from "react-hook-form";

const CreateEvent = (props) => {
  /**
   * object with input field values held in local state
   */
  const [inputFields, setInputFields] = useState([
    { eventName: "", eventLat: "", eventLon: "", eventRiddle: "" },
  ]);

  const { events } = useContext(AppContext);
  const location = useLocation();
  const { id } = location.state;

  useEffect(() => {
    console.log("ID", location.state);
  }, []);

  /**
   * handler to add an additional set of fields
   */
  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ eventName: "", eventLat: "", eventLon: "", eventRiddle: "" });
    setInputFields(values);
  };

  /**
   * handler to remove most recently added fields
   */
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  /**
   * handler for monitoring input change and updating local state value
   * NOTE that location data (lat, lng) is handled at the @LocationSearchInput child component level
   */
  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "eventName")
      values[index].eventName = event.target.value;
    else values[index].eventRiddle = event.target.value;
    setInputFields(values);
  };

  /**
   * @handleSelect is passed down to @LocationSearchInput via props
   * upon selecting an autocomplete option from the location field,
   * the @lat / @lng values are deconstructed and stored in local state
   */
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");

  /**
   * Upon making a selection, @address is parsed for the @lat / @lng values, which are stored in local state
   */
  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setNewLat(lat);
        setNewLng(lng);
      })
      .catch((error) => console.error("Error", error));
  };

  /**
   * form submit handler creates an object with relevant properties stored in local state
   * and updates database
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      event_name: inputFields[0]["eventName"],
      event_riddle: inputFields[0]["eventRiddle"],
      event_lat: newLat,
      event_long: newLng,
      hunt_id: id,
      event_index: events.length,
    };
    console.log(data);

    /**
     * Upon successful update, user is redirected back to the huntPage to which the event belongs
     */
    axios
      .post("http://localhost:3000/api/events/createEvent", data)
      .then((res) => {
        if (res.status === 200) {
          alert("Event successfully created!");
          props.history.push(`/hunt/${id}`);
        } else {
          alert("Error creating Event");
        }
      });
  };

  return (
    <>
      <h1>Create an Event!</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-col">
          {inputFields.map((inputField, index) => (
            <Fragment key={`${inputField}~${index}`}>
              <div className="form-group col-sm-6">
                <label htmlFor="eventName">Event Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  name="eventName"
                  value={inputField.eventName}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <label htmlFor="eventLocation" className="newLocationLabel">
                Event Location
              </label>
              <LocationSearchInput handleSelect={handleSelect} />
              <div className="form-group col-sm-4">
                <label htmlFor="eventRiddle">Event Riddle</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventRiddle"
                  name="eventRiddle"
                  value={inputField.eventRiddle}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group col-sm-2">
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleRemoveFields(index)}
                >
                  -
                </button>
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleAddFields()}
                >
                  +
                </button>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="submit-button">
          <Link
            className="btn btn-secondary mr-2"
            type="button"
            to={`/hunt/${id}`}

            // TODO NOTE: currentHunt is stored in localStorage to ensure persistence
          >{`Back to ${window.localStorage.currentHunt}`}</Link>
          <button
            className="btn btn-primary mr-2"
            type="submit"
            onSubmit={handleSubmit}
          >
            Save
          </button>
        </div>
        <br />
      </form>
    </>
  );
};

export default CreateEvent;
