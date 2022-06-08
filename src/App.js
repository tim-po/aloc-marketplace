/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from "react";

import StandardAppContainer from "./Standard/StandardAppContainer";
import Main from "./pages/Main";

export const App = () => {
  return (
      <StandardAppContainer showLocalisationControl={true} isDarkBG={false}>
          <Main />
      </StandardAppContainer>
  );
};
