import React, {useContext, ReactChild} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import styled from "styled-components";

const mockImage = 'https://pbs.twimg.com/media/FEaFK4OWUAAlgiV.jpg'

interface NFTArtworkProps {
  imageWidth: number
  imageHeight: number
}

const NFTArtworkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  margin-right: 80px;
  border-radius: 30px;
`

const ArtworkImage = styled.img<NFTArtworkProps>`
  width: ${p => p.imageWidth}px;
  height: ${p => p.imageHeight}px;
  border-radius: 30px 30px 0 0;
`

type NFTTileWithFormPropType = {
  imageWidth: number
  imageHeight: number
  children: ReactChild;
}

const NFTTileWithFormDefaultProps = {
  imageWidth: 340,
  imageHeight: 320
}

const NFTTileWithForm = (props: NFTTileWithFormPropType) => {
  const imgRef = React.createRef<HTMLImageElement>()
  const {locale} = useContext(LocaleContext)
  const {imageHeight, imageWidth, children} = props

  return (
    <NFTArtworkWrapper>
      <ArtworkImage
        ref={imgRef}
        src={mockImage}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
      {children}
    </NFTArtworkWrapper>
  )
};

NFTTileWithForm.defaultProps = NFTTileWithFormDefaultProps

export default NFTTileWithForm