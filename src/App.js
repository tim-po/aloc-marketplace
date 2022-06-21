/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from "react";

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
import CollectionContext from "./utils/CollectionContext";
import {useWeb3React} from "@web3-react/core";
import {useMarketplaceContract} from "./hooks/useMarketplaceContract";

const pages = [{title: 'Marketplace', url: '/projects'}, {title: 'Collection', url: '/collection'}]

export const App = () => {
  const {account, active} = useWeb3React()
  const marketplaceContract = useMarketplaceContract()

  const [collectionBubbleValue, setCollectionBubbleValue] = useState(0)
  const [collectionOpen, setCollectionOpen] = useState(false)

  async function updateUserBalance(){
    const NFTIdsArray = await marketplaceContract.methods.getNfts(account).call()
    setCollectionBubbleValue(NFTIdsArray.length)
  }

  useEffect(()=>{
    if(active) {
      updateUserBalance()
    }
  }, [active])


  return (
    <CollectionContext.Provider
      value={{
        bubbleCount: collectionBubbleValue,
        setCollectionBubbleValue: setCollectionBubbleValue,
        collectionOpen: collectionOpen,
        setCollectionOpen: setCollectionOpen
      }}
    >
      <Router>
        <StandardAppContainer logoHref={'/'} locales={['en', 'jp']} isDarkBG={false}>
            <Switch>
              <Route component={Main} path={'/'} exact />
              <Route component={Collection} path={'/collection'} exact />
              <Route component={Main} path={'/projects/:projectId'} exact />
              <Route component={CurrentNFT} path={'/nfts/:id'} exact />
            </Switch>
        </StandardAppContainer>
      </Router>
    </CollectionContext.Provider>
  );
};
