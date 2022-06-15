/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from "react";
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';

import StandardAppContainer from "./Standard/StandardAppContainer";
import Main from "./pages/Main";
import ProjectCollection from "./pages/ProjectCollection";
import CurrentNFT from "./pages/CurrentNFT";

export const App = () => {
  return (
      <Router>
        <StandardAppContainer showLocalisationControl={true} isDarkBG={false}>
          <Switch>
            <Route component={Main} path={'/'} exact />
            <Route component={ProjectCollection} path={'/projects/:id'} exact />
            <Route component={CurrentNFT} path={'/nfts/:id'} exact />
          </Switch>
        </StandardAppContainer>
      </Router>
  );
};
