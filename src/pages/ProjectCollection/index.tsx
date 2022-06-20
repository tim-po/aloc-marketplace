import React from "react";
import './index.css';
import {NFT} from "../../types";
import NFTTileSimple from "../../components/NFTTileSimple";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import styled from "styled-components";

type ProjectCollectionPropType = {
    name: string
    nfts: NFT[]
}

const ProjectCollectionPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`

const ProjectCollectionContainer = styled.div`
  max-width: 1088px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  @media screen and (max-width: 800px){
    justify-content: center;
  }
`

const ProjectCollection = (props: ProjectCollectionPropType) => {
    const {name, nfts} = props

    return (
        <ProjectCollectionPage>
          <MarketplaceHeader title={name} redirectTo={'/'}/>
            <ProjectCollectionContainer>
              {nfts?.map((nft) => <NFTTileSimple key={nft.projectId} nft={nft} /> )}
            </ProjectCollectionContainer>
        </ProjectCollectionPage>
    )
};

export default ProjectCollection

