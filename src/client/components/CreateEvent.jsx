import React, { useState, Fragment } from "react";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';

const CreateEvent = () => {
  const [inputFields, setInputFields] = useState([
    { eventName: "", eventLat: "", eventLon: "", eventRiddle: "" },
  ]);

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ eventName: "", eventLat: "", eventLon: "", eventRiddle: "" });
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "eventName") {
      values[index].eventName = event.target.value;
    } else if (event.target.name === "eventLat") {
      values[index].eventLat = event.target.value;
    } else if (event.target.name === "eventLon") {
      values[index].eventLon = event.target.value;
    } else {
      values[index].eventRiddle = event.target.value;
    }

    setInputFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("inputFields", inputFields);

    const data = {
      // const params = [req.body.event_name, req.body.event_index, req.body.event_lat, req.body.event_long, req.body.event_riddle, req.body.hunt_id];
      event_name: inputFields[0]["eventName"],
      event_riddle: inputFields[0]["eventRiddle"],
      event_lat: inputFields[0]["eventLat"],
      event_long: inputFields[0]["eventLon"],
    }

    console.log(data);

    axios.post('http://localhost:3000/api/events/createEvent', data)
    .then(res => {
      if (res.status === 200) {
        alert("Event successfully created. Return to Hunts List Page!")
        props.history.push('/')
      } else {
        alert("Error creating Event");
      }
    })
  };

  return (
    <>
      <Link to='/hunts'>Back to Hunts</Link>
      <h1>Create Hunt!</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
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
              <div className="form-group col-sm-4">
                <label htmlFor="eventLat">Event Latitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventLat"
                  name="eventLat"
                  value={inputField.eventLat}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="eventLon">Event Longitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventLon"
                  name="eventLon"
                  value={inputField.eventLon}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
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
          <button
            className="btn btn-primary mr-2"
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

export default CreateEvent;
