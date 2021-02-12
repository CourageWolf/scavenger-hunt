import React, { useState, Fragment, useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';
import PlacesAutocomplete from "react-places-autocomplete";
import { AppContext } from './ContextProvider';

import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import LocationSearchInput from "./LocationSearchInput";




const CreateHunt = () => {
  /**
   * object with input field values held in local state
   */
  const [inputFields, setInputFields] = useState([
    { huntName: "", huntLat: "", huntLon: "", huntDetail: "" },
  ]);
  const { user } = useContext(AppContext);

  /**
   * handler to add an additional set of fields
   */
  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ huntName: "", huntLat: "", huntLon: "", huntDetail: "" });
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
    if (event.target.name === "huntName") values[index].huntName = event.target.value;
    else values[index].huntDetail = event.target.value;
    setInputFields(values);
  };

  
  /**
   * @handleSelect is passed down to @LocationSearchInput via props 
   * upon selecting an autocomplete option from the location field, 
   * the @lat / @lng values are deconstructed and stored in local state
   */
  const [newLat, setNewLat] = useState('')
  const [newLng, setNewLng] = useState('')

  /* Upon making a selection, @address is parsed for the @lat / @lng values, which are stored in local state */ 
  const handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({lat, lng}) => {
        setNewLat(lat)
        setNewLng(lng)
      })
      .catch(error => console.error('Error', error));
  };

  /**
   * form submit handler creates an object with relevant properties stored in local state
   * and updates database
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      hunt_name: inputFields[0]["huntName"],
      hunt_des: inputFields[0]["huntDetail"],
      hunt_lat: newLat,
      hunt_long: newLng,
      hunt_votes: 0,
      user_id: user.user_id
    }

    axios.post('http://localhost:3000/api/hunts/createHunt', data)
    .then(res => {
      if (res.status === 200) {
        alert("Hunt successfully created. Return to Hunts List Page!")
        props.history.push('/')
      } else {
        alert("Error creating Hunt");
      }
    })
  };

  

  return (
    <>
      
      <h1>Create Hunt!</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-col">
          {inputFields.map((inputField, index) => (
            <Fragment key={`${inputField}~${index}`}>
              <div className="form-group col-sm-6">
                <label htmlFor="huntName">Hunt Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="huntName"
                  name="huntName"
                  value={inputField.huntName}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <label htmlFor="huntLocation" className="newLocationLabel">Hunt Starting Location</label>
              <LocationSearchInput handleSelect={handleSelect}/>
              <div className="form-group col-sm-6">
                <label htmlFor="huntDetail">Hunt Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="huntDetail"
                  name="huntDetail"
                  value={inputField.huntDetail}
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
      to='/hunts'
      className="btn btn-outline-secondary mr-2 w-50"
      type="button"
      >Back to Hunts</Link>
      <button
            className="btn btn-primary mr-2 w-50"
            type="submit"
            onSubmit={handleSubmit}
          >
            Save
          </button>
        </div>
        <br />
        {/* <pre>{JSON.stringify(inputFields, null, 2)}</pre> */}
      </form>
    </>
  );
};

export default CreateHunt;
