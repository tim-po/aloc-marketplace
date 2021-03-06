import React from 'react';

// Import colors from constants or use currentColor
// If icon uses more than one adjustable color you can pass colors from props
// BUT you must always provide default values for color props

export default () => {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.9375 21.8625H27.6L22.8375 15.45L18.975 20.5125L16.425 17.25L12.9375 21.8625ZM9.75 28.5C9.15 28.5 8.625 28.275 8.175 27.825C7.725 27.375 7.5 26.85 7.5 26.25V5.25C7.5 4.65 7.725 4.125 8.175 3.675C8.625 3.225 9.15 3 9.75 3H30.75C31.35 3 31.875 3.225 32.325 3.675C32.775 4.125 33 4.65 33 5.25V26.25C33 26.85 32.775 27.375 32.325 27.825C31.875 28.275 31.35 28.5 30.75 28.5H9.75ZM9.75 26.25H30.75V5.25H9.75V26.25ZM9.75 5.25V26.25V5.25ZM5.25 33C4.65 33 4.125 32.775 3.675 32.325C3.225 31.875 3 31.35 3 30.75V7.5H5.25V30.75H28.5V33H5.25Z"
            fill="white"
          />
      </svg>
    );
};
