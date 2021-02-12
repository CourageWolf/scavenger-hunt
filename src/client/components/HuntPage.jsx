import { GoogleMap, InfoWindow, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import EventListItem from './EventListItem';
import axios from 'axios';
import { AppContext } from './ContextProvider';
import PhotoInfoWindow from './PhotoInfoWindow';

const HuntPage = (props) => {
    const { id } = useParams();

    const {
      hunts,
      events,
      setEvents,
      user
    } = useContext(AppContext)

    const [currentHunt, setCurrentHunt] = useState('');

    /**
     * Iterate through array of hunts, until finding the one that matches the 
     * @id param 
     * @hunt_name is stored in @localStorage to ensure persistence
     * */
    useEffect(() => {
      for (const hunt of hunts) {
        console.log(hunt);
        if (hunt.hunt_id == id) {
          window.localStorage.currentHunt = hunt.hunt_name;
          break;
        }
      }
    }, [])

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.API_KEY

    });

    const [map, setMap] = useState(null);
    
    /**
     * map related variables stored in local state to allow for more maneuvaribility
     */
    const [center, setCenter] = useState({
      lat: 30.2674331,
      lng: -97.7419488
    })
    const [zoom, setZoom] = useState(15);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    /* array of {lat, lng} objects, in event order for purposes of tracing a polyline */
    const [eventPath, setEventPath] = useState([])

    /**
     * FIRST GET request to API to retrieve all event objects within selected hunt 
     *  each object is updated with an @event_pos property, which is also stored in 
     * an array (@evenPath ) in local state for purposes of rendering the Polyline between
     * event locations.
     * 
     * SECOND GET request is made if @eventArr is empty, and updates the @center local state variable 
     * to the location inputted in the New Hunt form, in order to enable map focus on that area
     */
    useEffect(() => {
      axios(`http://localhost:3000/api/events/getEventsByHunt/${id}`)
        .then(res => {
          console.log(res.data)
          const eventArr = res.data.map(event => {
            const posObj = {
              lat: event.event_lat,
              lng: event.event_long,
            };
            setEventPath(eventPath => [...eventPath, posObj]);
              return {
                ...event,
                event_pos: posObj
              }
          })
          setEvents(eventArr);
          return eventArr;
        })
        .then(eventArr => eventArr.length === 0 ? 
          axios(`http://localhost:3000/api/hunts/${id}`)
          .then(res => { 
            const pos = {
              lat: res.data[0].hunt_lat,
              lng: res.data[0].hunt_long
            }
            // console.log(pos)
            setCenter(pos)
          })
          .catch(err => console.log('GET Error retrieving hunt location'))
         : eventArr)
        .catch(err => console.log('GET Error retrieving all hunts in the area'))
    }, [])
    
    
    /* Iterate events to size, center, and zoom map to contain all markers  */
    const fitBounds = map => {
      const bounds = new google.maps.LatLngBounds();
      events.map(event => {
        // size bounds accordingly 
        console.log('EVENT', event, center)
        bounds.extend(event.event_pos);
        return event.event_id;
      })
      // auto-zoom
      map.fitBounds(bounds);
    }
    
    useEffect(() => {
      // Fit map bounds to contain all markers
      console.log('MAPREF', map)
      if (map && events.length > 0) {
        fitBounds(map);
        setZoom((zoom) => Math.max(zoom, 15));
      }
    }, [events, map])

    const onMapLoad = useCallback(map => {
      // Store a reference to the google map instance in state
      setMap(map);
    },[]);

    const onMapUnmount = useCallback(map => {
        setMap(null);
    }, [])

    const onSelectEventHandler = id => {
        if (!map) return;
        const { event_pos, event_name, event_riddle } = events.find(event => event.event_id === id);
        const { lat, lng } = event_pos;
        setSelectedEvent(<InfoWindow onCloseClick={() => { setSelectedEvent(null) }} position={{ lat, lng }}><><h3>{event_name}</h3><div>{event_riddle}</div></></InfoWindow>)
        map.setCenter({ lat, lng })
    };

    const uploadPhotoHandler = async (file, id) => {

        console.log(id)

        const { event_pos, event_name, event_riddle } = events.find(event => event.event_id === id);
        const { lat, lng } = event_pos;
        
        const formData = new FormData()
        formData.append(0, file);

        // Placeholder code to simulate upload photo asynchronously
        const response = await fetch(`http://localhost:3000/api/photos/image-upload/` + id + '/' + user.user_id, {
            method: 'POST',
            body: formData
          })
        const jsonRes = await response.json();
        console.log(jsonRes)
        // Request all Photo urls for this event from API
        const urls = jsonRes.map(curr => curr.photo_src)
        // TODO Once, the above line actually returns URLs, replace the prop value photoUrls with the urls array...
        setSelectedEvent(<PhotoInfoWindow onCloseClick={() => { setSelectedEvent(null) }} lat={lat} lng={lng} title={event_name} description={event_riddle} photoUrls={urls}/>)
    }

    /* Format options for the Polyline path */
     const pathOptions = {
      strokeColor: '#DC7633',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#DC7633',
      fillOpacity: 0.35,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
    }
    return (
        <>
            <Link to='/hunts'
                  className="btn btn-primary mr-2"
                  type="button"
            >Back to Hunts</Link>
            <h1>{window.localStorage.currentHunt}</h1>
            {
              isLoaded ?
                <GoogleMap 
                  center={center} 
                  // onCenterChanged ={() => setCenter(map.getCenter().toJSON())}
                  zoom={zoom} 
                  mapContainerStyle={{ height: '500px', width: '100%' }} 
                  onLoad={onMapLoad} 
                  onUnmount={onMapUnmount}>
                { events.map(event => <Marker key={event.event_id} position={event.event_pos} />)}
                {selectedEvent ? selectedEvent : <></>}
                <Polyline
                  path={eventPath}
                  options={pathOptions}
                />
                </GoogleMap>
                : <p>loading map...</p>
            }
            <div className='list-item-section'>
                {
                    events.map(event => <EventListItem key={event.event_id} id={event.event_id} title={event.event_name} uploadPhotoHandler={uploadPhotoHandler} description={event.event_riddle} onSelect={onSelectEventHandler.bind(this, event.event_id)} />)
                }
            </div>
            <Link to={{
                  pathname: '/createevent',
                  state: { id }
                }}
                className="btn btn-primary mr-2"
                type="button"
                >
            Create Event</Link>
            
        </>
    )
}

export default HuntPage;