/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from "react";

import StandardAppContainer from "./Standard/StandardAppContainer";
import Main from "./pages/Main";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Collection from "./pages/Collection";

const pages = [{title: 'Marketplace', url: '/projects'}, {title: 'Collection', url: '/collection'}]

export const App = () => {
  return (
      <Router>
          <StandardAppContainer showLocalisationControl={true} isDarkBG={false} pages={pages}>
              <Switch>
                  <Route path="/projects">
                      <Main />
                  </Route>
                  <Route path="/collection">
                      <Collection />
                  </Route>
                  <Route path='/' element={ <Redirect to="/projects" /> }/>
              </Switch>
          </StandardAppContainer>
      </Router>
  );
};
