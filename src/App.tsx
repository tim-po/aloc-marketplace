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
import {useAllocationMarketplaceContract} from "./hooks/useMarketplaceContract";
import {useHistory} from 'react-router-dom';
import BadNetworkError from "./pages/BadNetworkError";
import ProjectContext from "./utils/ProjectsContext";
import {NFT, ProjectsDict, Token} from "./types";
import {AllProjects} from "./mocks/AllProjects";
import {Contract} from "ethers";
import CurrentNft from "./contract/CurrentNft.json";
import {useWeb3} from "./Standard/hooks/useCommonContracts";

const pages = [{title: 'Marketplace', url: '/projects'}, {title: 'Collection', url: '/collection'}]

export const App = () => {
  const [allProjects, setAllProjects] = useState<ProjectsDict>({})

  const {account, active, chainId} = useWeb3React()
  const history = useHistory()
  const web3 = useWeb3();

  const [collectionBubbleValue, setCollectionBubbleValue] = useState(0)
  const [collectionOpen, setCollectionOpen] = useState(false)

  async function updateUserBalance() {
    const NFTIdsArray = await marketplaceContract.methods.getProjects().call()
    setCollectionBubbleValue(NFTIdsArray.length)
  }

  const marketplaceContract = useAllocationMarketplaceContract()

  async function getAllProjects() {
    let newProjects: ProjectsDict = {}
    for (let i = 0; i < 99999; i++) {
      let newProject: NFT
      try {
        newProject = {...(await marketplaceContract.methods.projects(i).call()), projectId: i}
      } catch {
        break
      }
      const tokens = await getAllNfts(newProject)
      newProjects[newProject.name] = {...newProject, tokens: tokens}
    }
    setAllProjects(newProjects)
  }

  async function getAllNfts(project: NFT){
    const NFTArrayFromContract: Token[] = []

    let newNftContract: Contract | undefined
    const abi = CurrentNft.abi;
    if (project.projectAddress){
      // @ts-ignore
      newNftContract = new web3.eth.Contract(abi, project.projectAddress);
    }

    for (let i = 0; i < 9999; i++) {
      let newProject: Token
      try {
        newProject = {...(await newNftContract?.methods.tokensInfo(i).call()), nftId: i, nftCreativeLink: AllProjects[project.name].nftsCreativeLinks[i], projectId: project.projectId}
      } catch {
        break
      }
      NFTArrayFromContract.push(newProject)
    }
    return(NFTArrayFromContract)
  }

  useEffect(() => {
    getAllProjects()
  }, [])

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
        <StandardAppContainer logoHref={'/'} locales={['en', 'jp']} isDarkBG={false} version={"1.0.0"}>
          <ProjectContext.Provider value={{setProjects: setAllProjects, projects: allProjects}}>
            <Route component={BadNetworkError} path={'/bad'}/>
            <Route component={Main} path={'/'} exact/>
            <Route component={Collection} path={'/collection'} exact/>
            <Route component={Main} path={'/projects/:projectId'} exact/>
            <Route component={CurrentNFT} path={'/nfts/:id'} exact/>
          </ProjectContext.Provider>
        </StandardAppContainer>
      </Router>
    </CollectionContext.Provider>
  );
};
