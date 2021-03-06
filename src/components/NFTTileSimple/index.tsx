import React from "react";
import './index.css'
import {wei2eth} from "../../Standard/utils/common";
import {useHistory} from "react-router-dom";
import {NFT, Token} from "../../types";
import styled from "styled-components"

type NFTTilePropType = {
  token?: Token,
  projectName?: string
}


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

const NFTProjectArtwork = styled.video`
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

  @media screen and (max-width: 900px){
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
  flex-direction: column;
  border-radius: 20px;
`

const NFTTileDefaultProps = {}

const NFTTileSimple = (props: NFTTilePropType) => {
  const {token, projectName} = props
  const history = useHistory();

  return (
    <FlexWrapper className={`${!token ? 'skeleton': ''}`}>
      <NFTTileWrapper onClick={token ? () => history.push(`/nfts/${projectName}-${token.nftId}`): ()=>{}}>
        <NFTProjectArtwork autoPlay loop muted>
          {!!token &&
            <source src={`${token.nftCreativeLink}`} type="video/webm"/>
          }
        </NFTProjectArtwork>
        <NFTProjectLimit className={'nft-project-name'}>{`Only ${token ? (+token.allocationLimit - +token.allocationAmount): 0} left `}</NFTProjectLimit>
      </NFTTileWrapper>
      <Price>{`${wei2eth(token ? token.price: 0)} BUSD`}</Price>
    </FlexWrapper>
  )
};

NFTTileSimple.defaultProps = NFTTileDefaultProps

export default NFTTileSimple