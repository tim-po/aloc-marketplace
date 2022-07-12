import React, {useEffect, useState} from "react";
import StandardAppContainer from "./Standard/StandardAppContainer";
import Main from "./pages/Main";
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect,
} from "react-router-dom";
import Collection from "./pages/Collection";
import CurrentNFT from "./pages/CurrentNFT";
import CollectionContext from "./utils/CollectionContext";
import {useWeb3React} from "@web3-react/core";
import {useMarketplaceContract} from "./hooks/useMarketplaceContract";
import {useHistory} from 'react-router-dom';
import BadNetworkError from "./pages/BadNetworkError";

const pages = [{title: 'Marketplace', url: '/projects'}, {title: 'Collection', url: '/collection'}]

export const App = () => {
  const {account, active, chainId} = useWeb3React()
  const marketplaceContract = useMarketplaceContract()
  const history = useHistory()

  const [collectionBubbleValue, setCollectionBubbleValue] = useState(0)
  const [collectionOpen, setCollectionOpen] = useState(false)

  async function updateUserBalance() {
    const NFTIdsArray = await marketplaceContract.methods.getNfts(account).call()
    setCollectionBubbleValue(NFTIdsArray.length)
  }

  useEffect(() => {
    if (active) {
      updateUserBalance()
    }
  }, [active])

  useEffect(() => {
    if (chainId && chainId !== 56)
        history.replace('/bad')
  }, [chainId])

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
          <Route component={BadNetworkError} path={'/bad'}/>
          <Route component={Main} path={'/'} exact/>
          <Route component={Collection} path={'/collection'} exact/>
          <Route component={Main} path={'/projects/:projectId'} exact/>
          <Route component={CurrentNFT} path={'/nfts/:id'} exact/>
        </StandardAppContainer>
      </Router>
    </CollectionContext.Provider>
  );
};
