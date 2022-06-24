import React, {useContext} from "react";
import LocaleContext from "../../Standard/LocaleContext";
import './index.css'
import {wei2eth} from "../../Standard/utils/common";
import {useHistory} from "react-router-dom";
import {NFT} from "../../types";
import styled from "styled-components"

const mockImage = 'https://pbs.twimg.com/media/FEaFK4OWUAAlgiV.jpg'

const NFTTileWrapper = styled.div`
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  max-width: max-content;
  margin-bottom: 16px;
  clip-path: content-box;
`

const NFTProjectLimit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 12px;
  top: 10px;
  padding-right: 6px;
  padding-left: 6px;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
`

const NFTProjectArtwork = styled.img`
  width: 340px;
  height: 320px;
  overflow: hidden;
  object-fit: cover;
  transition: 0.3s;
  display: block;
  z-index: 0;
  cursor: pointer;
  transform: scale(1);

  &:hover {
    transform: scale(1.2)
  }

  @media screen and (max-width: 800px){
    transform: scale(1) !important;
  }
`

const Price = styled.div`
  font-weight: 700;
  font-size: 20px;
`

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column
`



type NFTTilePropType = {
  nft: NFT,
}

const NFTTileDefaultProps = {}

const NFTTileSimple = (props: NFTTilePropType) => {
  const {nft} = props
  const {locale} = useContext(LocaleContext)
  const imgRef = React.createRef<HTMLImageElement>()
  const history = useHistory();

  return (
    <FlexWrapper>
      <NFTTileWrapper onClick={() => history.push(`/nfts/${nft.projectId}`)}>
        <NFTProjectArtwork ref={imgRef} className={'nft-project-artwork'} src={mockImage}/>
        <NFTProjectLimit className={'nft-project-name'}>{`Only ${+nft.limit - +nft.totalBought} left `}</NFTProjectLimit>
      </NFTTileWrapper>
      <Price>{`${wei2eth(nft.price)} BUSD`}</Price>
    </FlexWrapper>
  )
};

NFTTileSimple.defaultProps = NFTTileDefaultProps

export default NFTTileSimple