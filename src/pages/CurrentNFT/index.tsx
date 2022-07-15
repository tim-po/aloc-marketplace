import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import "./index.css";
import {localized} from "../../Standard/utils/localized";
import {NFT} from "../../types";
import {wei2eth} from "../../Standard/utils/common";
import SimpleValidatedInput from "../../components/SimpleValidatedInput";
import BigNumber from "bignumber.js";
import fromExponential from "from-exponential";
import {useBalanceOfBUSD} from "../../hooks/useBalance";
import {getAllocationMarketplaceContract} from "../../utils/getAddress";
import {useBUSDContract} from "../../Standard/hooks/useCommonContracts";
import {useWeb3React} from "@web3-react/core";
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import Spinner from "../../Standard/components/Spinner";
import {useParams} from "react-router-dom";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import NFTCountForm from "../../components/NFTCountForm";
import Notification from "../../components/Notification";
import styled from 'styled-components'
import CollectionContext from "../../utils/CollectionContext";
import { ArtworkImage, BoxShadowShiny } from "components/NFTTile/styled";

const mockImage = 'https://pbs.twimg.com/media/FEaFK4OWUAAlgiV.jpg'
const testEmailRegex = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

const INSUFFICIENT_BALANCE_ERROR_MESSAGE = "Insufficient balance";
const TRANSACTION_ERROR_MESSAGE = "Transaction failed";

const ALLOWANCE = 10 ** 10 * 10 ** 18

interface TextProps {
  fontSize: number
  fontWeight: number
  marginBottom?: number
}

interface ButtonProps {
  background: string
  textColor: string
  marginTop?: number
}

const CurrentNFTContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const NFTArtworkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  margin-right: 80px;
  border-radius: 30px;

  @media screen and (max-width: 800px){
    margin-right: 0px;
    margin-bottom: 20px;
  }
`

const NFTCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 430px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 0 0 30px 30px;
  font-weight: 700;
  font-size: 24px;

  @media screen and (max-width: 800px){
    width: 350px;
  }
`

const NFTCardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
  gap: 80px;
  @media screen and (max-width: 800px){
    gap: 30px;
  }
`

const Text = styled.div<TextProps>`
  font-size: ${p => p.fontSize}px;
  font-weight: ${p => p.fontWeight};
  margin-bottom: ${p => p.marginBottom}px;
`

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background: #33CC66;
  border-radius: 10px;
  font-weight: 700;
  font-size: 20px;
  color: ${p => p.textColor};
  background: ${p => p.background};
  outline: none;
  transition: background 0.3s ease;
  margin-top: ${p => p.marginTop}px;

  &:focus,
  &:active {
    outline: none;
  }
`

const SpinnerContainer = styled.div`
  position: absolute;
  right: 10px;
`


const CurrentNFT = () => {
  const {locale} = useContext(LocaleContext)
  const params: { id: string } = useParams()
  const imgRef = React.createRef<HTMLImageElement>()
  const busdContract = useBUSDContract()
  const marketplaceContract = useMarketplaceContract()
  const {account, active} = useWeb3React()
  const collectionContext = useContext(CollectionContext)

  const {balance, balanceLoading, updateBalance} = useBalanceOfBUSD()

  const [allowance, setAllowance] = useState<string>('0')
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [emailValid, setEmailValid] = useState(false)
  const [allocationAmountBusd, setAllocationAmountBusd] = useState<string | undefined>(undefined)
  const [allocationAmountBusdValid, setAllocationAmountBusdValid] = useState(false)

  const [nft, setNft] = useState<NFT | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(false)
  const [isApproveLoading, setIsApproveLoading] = useState(false)

  const [error, setError] = useState("")

  const isValid =
    nft &&
    emailValid &&
    allocationAmountBusdValid &&
    email != undefined &&
    allocationAmountBusd != undefined &&
    email != '' &&
    allocationAmountBusd != '' &&
    new BigNumber(allocationAmountBusd).multipliedBy(1000000000000000000).isLessThanOrEqualTo(nft.allocation)


  const displayError = (text: string, time: number) => {
    setError(text)
    setTimeout(() => {
      setError("")
    }, time)
  }

  useEffect(() => {
    getNFT()
  }, [])

  async function encryptEmail(email: string): Promise<{ encryptedEmail: string }> {
    const encryptEmailURL = 'https://encrypted-email-mmpro.herokuapp.com/encryptEmail'
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email})
    };
    return fetch(encryptEmailURL, requestOptions)
      .then(response => response.json())
  }

  async function getNFT() {
    const newNftData = await marketplaceContract.methods.projects(params.id).call()
    setNft(newNftData)
  }

  const getAllowance = async (): Promise<string> => {
    return await busdContract
      .methods
      .allowance(account, getAllocationMarketplaceContract())
      .call()
  }

  async function updateAllowance() {
    const newAllowance = await getAllowance()
    setAllowance(newAllowance)
  }

  const approve = async () => {

    if (isApproveLoading) {
      return
    }

    setIsApproveLoading(true)
    const amount2eth = fromExponential(ALLOWANCE);
    try {
      await busdContract
        .methods
        .approve(getAllocationMarketplaceContract(), amount2eth)
        .send({from: account}).once('receipt', () => {
          updateAllowance()
          setIsApproveLoading(false)
        });
    } catch (e) {
      setIsLoading(false)
    }
  };

  async function mintAndAllocate() {
    if (isValid) {
      const {encryptedEmail} = await encryptEmail(email)
      try {
        await marketplaceContract
          .methods
          .mintAndAllocate(`${params.id}`, `${(new BigNumber(10).pow(18).multipliedBy(+allocationAmountBusd)).toString()}`, encryptedEmail)
          .send({from: account}).once('receipt', () => {
            setIsLoading(false)
            setEmail('')
            setAllowance('')
            collectionContext.setCollectionBubbleValue(collectionContext.bubbleCount + 1)
          });
      } catch (e) {
        setIsLoading(false)
      }
    }
  }

  const handleBuy = async () => {
    if (isLoading) {
      return
    }

    if (!isValid && !isApprovalRequired()) {
      return
    }


    if (nft && parseInt(nft.price.toString()) > parseInt(balance)) {
      displayError(INSUFFICIENT_BALANCE_ERROR_MESSAGE, 2000);
      return
    }

    setIsLoading(true)
    try {
      await mintAndAllocate()
      await updateBalance()
      setError("")
    } catch (e) {
      displayError(TRANSACTION_ERROR_MESSAGE, 2000)
      console.log({error: e})
    }
    setIsLoading(false)

  }

  const isApprovalRequired = () => nft && (parseInt(allowance) < parseInt(nft.price.toString()))

  useEffect(() => {
    if (active) {
      updateAllowance()
    }
  }, [active])

  if (!nft) {
    return null
  }

  return (
    <CurrentNFTContainer>
      <MarketplaceHeader title={nft.name} redirectTo={`/projects/${nft.name}`}/>
      <NFTCardWrapper>
        <BoxShadowShiny>
          <ArtworkImage src={mockImage} maxWidth={430}/>
          <NFTCountForm countOfNFT={+nft.limit - +nft.totalBought}/>
        </BoxShadowShiny>
        <div className="current-nft-form">
          <Text fontWeight={700} fontSize={40} marginBottom={40}>{nft.name}</Text>
          <Text fontWeight={700} fontSize={24} marginBottom={20}>{`Base price: ${wei2eth(nft.price)} BUSD`}</Text>
          <Text fontWeight={700} fontSize={24}
                marginBottom={40}>{`Max allocation: ${wei2eth(nft.allocation)} BUSD`}</Text>
          {!account ?
            <Notification body={'Please connect wallet to allocate'} />
            :
            <>
              {
                isApprovalRequired()
                  ?
                  <Button
                    textColor={'#fff'}
                    background={'#33CC66'}
                    onClick={approve}
                  >
                    Approve
                    {
                      isApproveLoading ?
                        <SpinnerContainer>
                          <Spinner color={'white'} size={25}/>
                        </SpinnerContainer>
                        :
                        null
                    }
                  </Button>
                  :
                  <>
                    <SimpleValidatedInput
                      className="w-full"
                      onChange={(e) => setEmail(e.target.value)}
                      onValidationChange={(isValid) => setEmailValid(isValid)}
                      validationFunction={(text) => testEmailRegex.test(text)}
                      errorTooltipText={'Please enter a correct email'}
                      placeholder="Email"
                      type="email"
                      autocomplete="email"
                    />
                    <SimpleValidatedInput
                      hasDefaultValueButton
                      defaultValueButtonText={'Max'}
                      defaultValue={wei2eth(nft.allocation).toString()}
                      shouldValidateOnInput
                      className="w-full"
                      placeholder="Your allocation in BUSD"
                      onChange={(e) => setAllocationAmountBusd(e.target.value)}
                      onValidationChange={(isValid) => setAllocationAmountBusdValid(isValid)}
                      validationFunction={(text) => !isNaN(+text) && text != ''}
                      errorTooltipText={'Please enter a number'}
                    />
                    <Button
                      marginTop={21}
                      textColor={isValid ? '#fff' : 'rgba(255, 255, 255, 0.6)'}
                      background={isValid ? '#33CC66' : 'rgba(0, 0, 0, 0.2)'}
                      onClick={() => handleBuy()}
                    >
                      Allocate
                      <SpinnerContainer>
                        <Spinner color={'white'} size={isLoading ? 25: 0}/>
                      </SpinnerContainer>
                    </Button>
                  </>
              }
            </>
          }
        </div>
      </NFTCardWrapper>
    </CurrentNFTContainer>
  )
};

export default CurrentNFT

