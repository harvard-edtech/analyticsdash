/**
 * Loading spinner/indicator
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

// Import style
import './LoadingSpinner.css';

class LoadingSpinner extends Component {
  render() {
    return (
      <div className="text-center LoadingSpinner-container">
        <FontAwesomeIcon
          icon={faCircle}
          className="LoadingSpinner-blip-1 mr-1"
        />
        <FontAwesomeIcon
          icon={faCircle}
          className="LoadingSpinner-blip-2 mr-1"
        />
        <FontAwesomeIcon
          icon={faCircle}
          className="LoadingSpinner-blip-3 mr-1"
        />
        <FontAwesomeIcon
          icon={faCircle}
          className="LoadingSpinner-blip-4"
        />
      </div>
    );
  }
}

export default LoadingSpinner;
