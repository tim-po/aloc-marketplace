import React from 'react';

// Import colors from constants or use currentColor
// If icon uses more than one adjustable color you can pass colors from props
// BUT you must always provide default values for color props

export default () => {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.78125 23.5312L6.46875 22.2187L13.6875 15L6.46875 7.78125L7.78125 6.46875L15 13.6875L22.2187 6.46875L23.5312 7.78125L16.3125 15L23.5312 22.2187L22.2187 23.5312L15 16.3125L7.78125 23.5312Z" fill="white"/>
      </svg>
    );
};
