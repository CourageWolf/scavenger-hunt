import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventListItem from './EventListItem';

const HuntPage = (props) => {
    const { id } = useParams();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.API_KEY
        
    });
    
    const [map, setMap] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const onMapLoad = useCallback(map => {
        setMap(map);
    }, []);

    const onMapUnmount = useCallback(map => {
        setMap(null);
    }, [])

    const onSelectEventHandler = id => {
        if (!map) return;
        const { pos, title, description } = events.find(event => event.id === id);
        const { lat, lng } = pos;
        setSelectedEvent(<InfoWindow position={{ lat, lng }}><><h3>{title}</h3><div>{description}</div></></InfoWindow>)
        map.setCenter({ lat, lng })
    };

    // TODO How can I get the ID of the event in here?
    const uploadPhotoHandler = (file, id) => {
        // // formData.forEach(file=>console.log(file));
        // console.log(file);
        const { pos, title, description } = events.find(event => event.id === id);
        const { lat, lng } = pos;
        setSelectedEvent(<InfoWindow position={{ lat, lng }}><><h3>{title}</h3><div>{description}</div><div><img style={{width: '50%', height: '50%'}} src={URL.createObjectURL(file)}/></div></></InfoWindow>)
    }

    /*
     * Begin Stub Data
     */
    const center = {
        lat: 30.2674331,
        lng: -97.7419488
    }
    const events = [{
        id: 0,
        title: 'Shakespeare Bar',   
        description: '$7 pitchers and that weird Austin vibe. Take a picture with the ice cream truck.',
        pos: {
            lat: 30.2674331,
            lng: -97.7419488
        }
    },
    {
        id: 1,
        title: 'The Jackalope',
        description: 'Take a picture with the DJ.',
        pos: {
            lat: 30.2671304,
            lng: -97.7411892
        }
    },
    {
        id: 2,
        title: 'YETI Austin Flagship',
        description: 'Didn\'t know the cooler brand had a bar? Cross the river to see it. Take a picture with the yeti.',
        pos: {
            lat: 30.2593641,
            lng: -97.7485306,
        }
    }]
    /*
     * End Stub Data
     */

    return (
        <>
            <Link to='/hunts'>back to Hunts</Link>
            <h1>Hunt Page {id}</h1>
            {
                isLoaded ?
                    <GoogleMap zoom={16} mapContainerStyle={{ height: '500px', width: '100%' }} center={center} onLoad={onMapLoad} onUnmount={onMapUnmount}>
                        {/* Load Markers */}
                        {
                            events.map(event => <Marker key={event.id} position={event.pos} />)
                        }
                        {
                            selectedEvent ? selectedEvent : <></>
                        }
                    </GoogleMap>
                    : <p>loading map...</p>
            }
            <div className='list-item-section'>
                {
                    events.map(event => <EventListItem key={event.id} id={event.id} title={event.title} uploadPhotoHandler={uploadPhotoHandler} description={event.description} onSelect={onSelectEventHandler.bind(this, event.id)} />)
                }
            </div>
        </>
    )
}

export default HuntPage;