import React from 'react';
import './Spinner.scss';

const Spinner = () => (
  <div className="loader-parent">
    <div className="loader-sticky">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  </div>
);

export default Spinner;
