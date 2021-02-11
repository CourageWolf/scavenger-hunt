import React, { useState, Fragment, useContext } from "react";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import { AppContext } from './ContextProvider';
import axios from 'axios';

const CreateHunt = (props) => {
  const { user } = useContext(AppContext);
  const [inputFields, setInputFields] = useState([
    { huntName: "", huntLat: "", huntLon: "", huntDetail: "" },
  ]);

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ huntName: "", huntLat: "", huntLon: "", huntDetail: "" });
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "huntName") {
      values[index].huntName = event.target.value;
    } else if (event.target.name === "huntLat") {
      values[index].huntLat = event.target.value;
    } else if (event.target.name === "huntLon") {
      values[index].huntLon = event.target.value;
    } else {
      values[index].huntDetail = event.target.value;
    }

    setInputFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("inputFields", inputFields);

    const data = {
      //const params = [req.body.hunt_name, req.body.hunt_des, req.body.hunt_votes, req.body.hunt_banner, req.body.hunt_lat, req.body.hunt_long, req.body.user_id];
      hunt_name: inputFields[0]["huntName"],
      hunt_des: inputFields[0]["huntDetail"],
      hunt_lat: inputFields[0]["huntLat"],
      hunt_long: inputFields[0]["huntLon"],
      hunt_votes: 0,
      user_id: user.user_id
    }

    console.log(data);

    axios.post('http://localhost:3000/api/hunts/createHunt', data)
    .then(res => {
      if (res.status === 200) {
        alert("Hunt successfully created. Return to Hunts List Page!");
        props.history.push('/hunts');
      } else {
        alert("Error creating Hunt");
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
              <div className="form-group col-sm-4">
                <label htmlFor="huntLat">Hunt Latitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="huntLat"
                  name="huntLat"
                  value={inputField.huntLat}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="huntLon">Hunt Longitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="huntLon"
                  name="huntLon"
                  value={inputField.huntLon}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group col-sm-4">
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

export default CreateHunt;
