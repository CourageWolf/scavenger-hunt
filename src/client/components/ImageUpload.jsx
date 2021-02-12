import React, { useRef, useState } from "react";

/**
 *
 * @callback props.uploadPhotoHandler First argument will be FormData <https://developer.mozilla.org/en-US/docs/Web/API/FormData> with files
 */

const ImageUpload = ({ uploadPhotoHandler, title }) => {
  const inputFile = useRef(null);
  const onFileSelection = (event) => {
    // const formData = new FormData();
    // formData.append(0, event.target.files[0]);
    if (uploadPhotoHandler) uploadPhotoHandler(event.target.files[0]);
  };
  const onClickUpload = (event) => {
    inputFile.current.click();
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        type="file"
        ref={inputFile}
        onChange={onFileSelection}
      />
      <button 
      className="btn btn-info mr-2"
      onClick={onClickUpload}>{title}</button>
    </>
  );
};

export default ImageUpload;
