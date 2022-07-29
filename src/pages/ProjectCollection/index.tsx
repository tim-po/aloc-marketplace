import React, {useEffect, useState} from "react";
import './index.css';
import {NFT, ProjectsDict, Token} from "../../types";
import NFTTileSimple from "../../components/NFTTileSimple";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import styled from "styled-components";
import {useNftContract} from "../../hooks/useNftContract";
import {AllProjects} from "../../mocks/AllProjects";
import Spinner from "../../Standard/components/Spinner";

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
  const {project} = props

  return (
    <ProjectCollectionPage>
      <MarketplaceHeader title={project.name} redirectTo={'/'}/>
      <ProjectCollectionContainer>
        {
          project.tokens ?
            <>
              {project.tokens?.map((token: Token) => <NFTTileSimple key={token.nftId} projectName={project.name} token={token}/>)}
            </>
            :
            <Spinner color={'white'} size={25} />
        }
      </ProjectCollectionContainer>
    </ProjectCollectionPage>
  )
};

export default ProjectCollection

