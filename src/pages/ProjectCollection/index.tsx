import React, {useEffect, useState} from "react";
import './index.css';
import {NFT, ProjectsDict} from "../../types";
import NFTTileSimple from "../../components/NFTTileSimple";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import styled from "styled-components";
import {useNftContract} from "../../hooks/useNftContract";
import {AllProjects} from "../../mocks/AllProjects";

type ProjectCollectionPropType = {
  name: string
  project: any
}

const ProjectCollectionPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`

const ProjectCollectionContainer = styled.div`
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 40px;

  @media screen and (max-width: 800px) {
    justify-content: center;
  }
`

const ProjectCollection = (props: ProjectCollectionPropType) => {
  const {name, project} = props

  const currentNftContract = useNftContract(project[0].projectAddress)
  const [nfts, setNfts] = useState<any>(undefined)

  async function getAllProjects(){
    const NFTArrayFromContract: NFT[] = []
    const newProjectsById: {[key: string]: string} = {}
    for (let i = 0; i < 9999; i++) {
      let newProject: NFT
      try {
        newProject = {...(await currentNftContract?.methods.tokensInfo(i).call()), nftId: i, nftCreativeLink: AllProjects[project[0].name].nftsCreativeLinks[i], projectId: project[0].projectId}
      } catch {
        break
      }
      newProjectsById[i] = newProject.name
      NFTArrayFromContract.push(newProject)
    }
    setNfts(NFTArrayFromContract)
  }

  useEffect(() => {getAllProjects()}, [])

  return (
    <ProjectCollectionPage>
      <MarketplaceHeader title={name} redirectTo={'/'}/>
      <ProjectCollectionContainer>
        {nfts?.map((nft: any) => <NFTTileSimple key={nft.name} nft={nft}/>)}
      </ProjectCollectionContainer>
    </ProjectCollectionPage>
  )
};

export default ProjectCollection

