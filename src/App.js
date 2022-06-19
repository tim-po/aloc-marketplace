/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useState} from "react";

import StandardAppContainer from "./Standard/StandardAppContainer";
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
import CollectionBubbleContext from "./utils/CollectionBubbleContext";

const pages = [{title: 'Marketplace', url: '/projects'}, {title: 'Collection', url: '/collection'}]

export const App = () => {
  const [collectionBubbleValue, setCollectionBubbleValue] = useState(0)
  return (
    <CollectionBubbleContext.Provider value={{ bubbleCount: collectionBubbleValue, setCollectionBubbleValue: setCollectionBubbleValue }}>
      <Router>
        <StandardAppContainer locales={['en', 'jp']} isDarkBG={false}>
            <Switch>
              <Route component={Main} path={'/'} exact />
              <Route component={Collection} path={'/collection'} exact />
              <Route component={Main} path={'/projects/:projectId'} exact />
              <Route component={CurrentNFT} path={'/nfts/:id'} exact />
            </Switch>
        </StandardAppContainer>
      </Router>
    </CollectionBubbleContext.Provider>
  );
};
