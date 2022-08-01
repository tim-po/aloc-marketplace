import React from "react";
import './index.css';
import {NFT, Token} from "../../types";
import NFTTileSimple from "../../components/NFTTileSimple";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import styled from "styled-components";
import Spinner from "../../Standard/components/Spinner";
import {useParams} from "react-router-dom";

type ProjectCollectionPropType = {
  project: NFT
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

  @media screen and (max-width: 900px) {
    justify-content: center;
  }
`

const ProjectCollection = (props: ProjectCollectionPropType) => {
  const params: { projectId: string } = useParams()
  const {project} = props

  return (
    <ProjectCollectionPage>
      <MarketplaceHeader title={params.projectId} redirectTo={'/'}/>
      <ProjectCollectionContainer>
        {
          (project && project.tokens) ?
            <>
              {project.tokens?.map((token: Token) => <NFTTileSimple key={token.nftId} projectName={project.name} token={token}/>)}
            </>
            :
            <>
              <NFTTileSimple />
              <NFTTileSimple />
              <NFTTileSimple />
              <NFTTileSimple />
              <NFTTileSimple />
            </>
        }
      </ProjectCollectionContainer>
    </ProjectCollectionPage>
  )
};

export default ProjectCollection

