import React, {useState} from "react";
import './index.css'
import styled from "styled-components";
import SimpleValidatedInput from "../SimpleValidatedInput";
import {useAllocationMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import Spinner from "../../Standard/components/Spinner";
import {NFT, Token} from "../../types";
import {wei2eth} from "../../Standard/utils/common";

interface TextProps {
  fontWeight: number
  marginBottom?: number
}

interface ButtonProps {
  background: string
  textColor: string
}

type NFTTransferFormPropType = {
  nft: Token
}

const NFTTransferFormDefaultProps = {}

const testAddressRegex = /0x*/g;

const NFTTransferFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0 0 30px 30px;
  padding: 8px 12px;
`
const Text = styled.span<TextProps>`
  font-weight: ${p => p.fontWeight};
  font-size: 20px;
  margin-bottom: ${p => p.marginBottom}px;
`

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 50px;
  background: #33CC66;
  border-radius: 10px;
  font-weight: 700;
  font-size: 20px;
  color: ${p => p.textColor};
  background: ${p => p.background};
  outline: none;
  transition: background 0.3s ease;
  margin-left: 12px;

  &:focus,
  &:active {
    outline: none;
  }
`
const FlexWrapper = styled.div`
  display: flex;
`

const NFTTransferForm = (props: NFTTransferFormPropType) => {
  const {nft} = props
  const {account} = useWeb3React()
  const marketplaceContract = useAllocationMarketplaceContract()
  const [transferAddress, setTransferAddress] = useState<string | undefined>(undefined)
  const [transferAddressValid, setTransferAddressValid] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  return (
    <NFTTransferFormContainer>
      <Text fontWeight={400} marginBottom={14}>
        Allocation: <Text fontWeight={700}>{`${nft.allocationAmount} BUSD`}</Text>
      </Text>
    </NFTTransferFormContainer>
  )
};

NFTTransferForm.defaultProps = NFTTransferFormDefaultProps

export default NFTTransferForm