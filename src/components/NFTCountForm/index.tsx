import React from "react";
import './index.css'
import styled from "styled-components";

const NFTCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 0 0 30px 30px;
  font-weight: 700;
  font-size: 24px;

  @media screen and (max-width: 900px){
    width: 350px;
  }
`

type NFTCountFormPropType = {
  countOfNFT: number
}

const NFTCountFormDefaultProps = {}

const NFTCountForm = (props: NFTCountFormPropType) => {
  const {countOfNFT} = props

  return <NFTCount>{`Only ${countOfNFT} left`}</NFTCount>
};

NFTCountForm.defaultProps = NFTCountFormDefaultProps

export default NFTCountForm