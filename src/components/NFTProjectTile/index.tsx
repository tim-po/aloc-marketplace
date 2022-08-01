import React, {useEffect, useState} from "react";
import './index.css'
import {useHistory, useParams} from "react-router-dom";
import styled from "styled-components";
import {NFT} from "../../types";
import {AllProjects} from "../../mocks/AllProjects";
import {useNftContract} from "../../hooks/useNftContract";

interface TextProps {
  fontSize: number
  fontWeight: number
  marginBottom?: number
}

const TileWrapper = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 16px;
  width: 336px;
  cursor: pointer;
`

const Logo = styled.video`
  width: 67px;
  height: 67px;
  border: 3px solid #FFFFFF;
  border-radius: 8px;
  margin-bottom: 8px;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 16px;
  min-width: 67px;
`
const TextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`

const Text = styled.div<TextProps>`
  font-size: ${p => p.fontSize}px;
  font-weight: ${p => p.fontWeight};
  margin-bottom: ${p => p.marginBottom}px;
`

const GradientText = styled.div`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(90deg, #4AEA7F 0%, #FFFFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`

type NFTTilePropType = {
  project: NFT
}

const NFTProjectTile = (props: NFTTilePropType) => {
  const {project} = props
  const history = useHistory();
  const [countOfNft, setCountOfNft] = useState<number>((project.tokens || []).length)

  const isSkeleton = (project.name === "")

  return (
    <TileWrapper className={`${isSkeleton ? 'skeleton' : ''}`}
                 onClick={() => history.push(`/projects/${project.name}`)}>
      <LogoWrapper>
        <Logo autoPlay loop muted>
          {!isSkeleton &&
            <source src={`${AllProjects[project.name].creativeLink}`} type="video/mp4"/>
          }
        </Logo>
        <GradientText>{countOfNft} NFT</GradientText>
      </LogoWrapper>
      <TextWrapper>
        <Text fontSize={24} fontWeight={700} marginBottom={4}>{project.name}</Text>
        {!isSkeleton &&
          <Text fontSize={14} fontWeight={400}>{!isSkeleton ? AllProjects[project.name].description : ''}</Text>
        }
      </TextWrapper>
    </TileWrapper>
  )
};

export default NFTProjectTile