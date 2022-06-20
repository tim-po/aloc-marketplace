import React, {useContext, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import styled from "styled-components";
import SimpleValidatedInput from "../SimpleValidatedInput";
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import Spinner from "../../Standard/components/Spinner";
import {NFT} from "../../types";
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
  nft: NFT[]
}

const NFTTransferFormDefaultProps = {}

const testAdressRegex = /0x*/g;

const NFTTransferFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 340px;
  height: 130px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
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
  const {locale} = useContext(LocaleContext)
  const {nft} = props
  const {account} = useWeb3React()
  const marketplaceContract = useMarketplaceContract()
  console.log(nft)
  const [transferAddress, setTransferAddress] = useState<string | undefined>(undefined)
  const [transferAddressValid, setTransferAddressValid] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const isValidForTransfer =
    transferAddressValid &&
    transferAddress !== ''

  // && nft.id

  function transfer() {

    if(isLoading) {
      return
    }

    if (isValidForTransfer && nft[0].id) {
      setIsLoading(true)
      marketplaceContract.methods.safeTransferFrom(account, transferAddress, `${+nft[0].id}`, '1', '0x0')
        .send({from: account})
        .once('receipt', () => {
          setIsLoading(false)
        })
    }
  }

  return (
    <NFTTransferFormContainer>
      <Text fontWeight={400} marginBottom={14}>
        Allocation:
        <Text fontWeight={700}>{`${wei2eth(nft[0].allocation)} BUSD`}</Text>
      </Text>
      <FlexWrapper>
        <SimpleValidatedInput
          className="w-full"
          onChange={(e) => setTransferAddress(e.target.value)}
          onValidationChange={(isValid) => setTransferAddressValid(isValid)}
          validationFunction={(text) => testAdressRegex.test(text)}
          errorTooltipText={'Please enter a correct address'}
          placeholder="Transfer address"
        />
        <Button
          background={isValidForTransfer ? '#33CC66' : 'rgba(0, 0, 0, 0.2)'}
          textColor={isValidForTransfer ? '#fff' : 'rgba(255, 255, 255, 0.6)'}
        >
          {
            isLoading ?
              <Spinner color={'white'} size={25}/>
              :
              'Transfer'
          }
        </Button>
      </FlexWrapper>
    </NFTTransferFormContainer>
  )
};

NFTTransferForm.defaultProps = NFTTransferFormDefaultProps

export default NFTTransferForm