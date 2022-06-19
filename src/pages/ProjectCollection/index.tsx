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

const ProjectCollectionContainer = styled.div`
  padding: 0 170px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`

const ProjectCollection = (props: ProjectCollectionPropType) => {
    const {name, nfts} = props

    return (
        <>
          <MarketplaceHeader title={name} redirectTo={'/'}/>
            <ProjectCollectionContainer>
              {nfts?.map((nft) => <NFTTileSimple key={nft.projectId} nft={nft} /> )}
            </ProjectCollectionContainer>
        </>
    )
};

export default ProjectCollection

