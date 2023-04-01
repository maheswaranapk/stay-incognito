/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import download from 'downloadjs';

import './Document.scss';

const Document = ({ fileData }) => {
  const { file, filename, filetype } = fileData;

  const downloadBlob = () => {
    download(file, filename, filetype);
  };
  return (
    <div className="document-parent py-2 mx-auto">
      <div className="d-flex flex-row align-items-center">
        <i className="fas fa-file mr-1" />
        <div className="flex-grow-1 px-2">{filename}</div>
        <i
          className="fas fa-arrow-alt-circle-down cursor-pointer text-primary p-2"
          onClick={downloadBlob}
          role="button"
        />
      </div>
    </div>
  );
};

export default Document;
