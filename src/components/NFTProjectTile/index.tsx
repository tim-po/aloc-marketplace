import React from "react";
import './index.css'
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {NFT} from "../../types";
import {AllProjects} from "../../mocks/AllProjects";

interface TextProps {
  fontSize: number
  fontWeight: number
  marginBottom?: number
}

const mockImage = 'https://pbs.twimg.com/media/FEaFK4OWUAAlgiV.jpg'

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
  project: NFT[]
}

const NFTProjectTile = (props: NFTTilePropType) => {
  const {project} = props
  const imgRef = React.createRef<HTMLImageElement>()
  const history = useHistory();
  return (
    <TileWrapper onClick={() => history.push(`/projects/${project[0].name}`)}>
      <LogoWrapper>
        <Logo autoPlay loop muted>
          <source src={`${AllProjects[project[0].name].creativeLink}`} type="video/webm"/>
        </Logo>
        <GradientText>{project.length} NFT</GradientText>
      </LogoWrapper>
      <TextWrapper>
        <Text fontSize={24} fontWeight={700} marginBottom={4}>{project[0].name}</Text>
        <Text fontSize={12} fontWeight={400} marginBottom={8}>by Author.</Text>
        <Text fontSize={12} fontWeight={400}>{AllProjects[project[0].name].description}</Text>
      </TextWrapper>
    </TileWrapper>
  )
};

export default NFTProjectTile