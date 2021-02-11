import React, {useContext} from 'react';
import ImageUpload from './ImageUpload';

import { AppContext } from './ContextProvider';

const EventListItem = ({ title, description, onSelect, uploadPhotoHandler, id }) => {
    const { user } = useContext(AppContext);

    return (
        <div className="list-item-container">
            <div className="listItem">
                <div className="text-container">
                    <div className="title">
                        {title}
                    </div>
                    <div className="description">
                        {description}
                    </div>
                </div>
                <div className="navigate-container">
                    <div className="navigate">
                        <button onClick={onSelect}>View</button>
                        {/* <input type='file' id='single' onChange={uploadImage} />  */}
                        <ImageUpload uploadPhotoHandler={uploadPhotoHandler} title="&#10003;"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventListItem;