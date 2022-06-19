/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from "react";

import Index from "./Standard/StandardAppContainer";
import Main from "./pages/Main";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Collection from "./pages/Collection";
import ProjectCollection from "./pages/ProjectCollection";
import CurrentNFT from "./pages/CurrentNFT";

const pages = [{title: 'Marketplace', url: '/projects'}, {title: 'Collection', url: '/collection'}]

export const App = () => {
  return (
      <Router>
        <Index showLocalisationControl={true} isDarkBG={false} pages={pages}>
          <Switch>
            <Route component={Main} path={'/projects'} exact />
            <Route component={Collection} path={'/collection'} exact />
            <Route component={Main} path={'/projects/:projectId'} exact />
            <Route component={CurrentNFT} path={'/nfts/:id'} exact />
          </Switch>
        </Index>
      </Router>
  );
};
