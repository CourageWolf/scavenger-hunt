import { InfoWindow } from '@react-google-maps/api';
import React from 'react';

const PhotoInfoWindow = ({ photoUrls, title, description, onCloseClick, lat, lng }) => {

    const renderImgElements = urls => {
        return urls.map(url => <img src={url} style={{ width: '300px', height: '100%', margin: '0 5px' }} />)
    }

    return (
        <InfoWindow maxWidth = "400px" onCloseClick={onCloseClick} position={{ lat, lng }}>
            <>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="photo-container">
                    {renderImgElements(photoUrls)}
                </div>
            </>
        </InfoWindow>
    )
}

export default PhotoInfoWindow;