import React, {useContext, useEffect, useState} from "react";
import "./index.css";
import {wei2eth} from "../../Standard/utils/common";
import BigNumber from "bignumber.js";
import fromExponential from "from-exponential";
import {useBalanceOfBUSD} from "../../hooks/useBalance";
import {useBUSDContract} from "../../Standard/hooks/useCommonContracts";
import {useWeb3React} from "@web3-react/core";
import {useAllocationMarketplaceContract} from "../../hooks/useMarketplaceContract";
import Spinner from "../../Standard/components/Spinner";
import {useParams} from "react-router-dom";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import NFTCountForm from "../../components/NFTCountForm";
import Notification from "../../components/Notification";
import styled from 'styled-components'
import CollectionContext from "../../utils/CollectionContext";
import { ArtworkImage, BoxShadowShiny } from "components/NFTTile/styled";
import SimpleInput from "../../Standard/components/SimpleInput";
import useValidatedState, {validationFuncs} from "../../Standard/hooks/useValidatedState";
import {useNftContract} from "../../hooks/useNftContract";
import {AllProjects} from "../../mocks/AllProjects";
import {getBUSDAddress, getMMProAddress} from "../../Standard/utils/getCommonAdress";
import {usePancakeRouterContract} from "../../Standard/hooks/useCommonContracts";
import WalletConnectorBubbleContext from "../../Standard/WalletConnectorBubbleContext";
import ProjectContext from "../../utils/ProjectsContext";


const INSUFFICIENT_BALANCE_ERROR_MESSAGE = "Insufficient balance";
const TRANSACTION_ERROR_MESSAGE = "Transaction failed";

const ALLOWANCE = 10 ** 10 * 10 ** 18

const SLIPPAGE_PERCENT = 0.93

const DEADLINE_OVER_NOW = 1000

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

const NFTCardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
  gap: 80px;
  
  @media screen and (max-width: 900px) {
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
  const params: { id: string } = useParams()
  const busdContract = useBUSDContract()
  const pancakeRouterContract = usePancakeRouterContract();
  const {account, active} = useWeb3React()
  const collectionContext = useContext(CollectionContext)
  const {projects} = useContext(ProjectContext)
  const {setBubbleValue, setAccentedControlButton} = useContext(WalletConnectorBubbleContext)

  const {balance, updateBalance} = useBalanceOfBUSD()

  const [allowance, setAllowance] = useState<string>('0')
  const [[email, setEmail], emailValid] = useValidatedState<string>("", validationFuncs.isEmail)
  const [[allocationAmountBusd, setAllocationAmountBusd], allocationAmountBusdValid] = useValidatedState<string>('', newValue => !isNaN(+newValue) && (!token || +newValue <= wei2eth(token.maxAllocation)))

  console.log(params.id.split("-")[0])
  console.log(projects)

  const project = projects[params.id.split("-")[0]]
  const token = (project && project.tokens) ? project.tokens[+params.id.split("-")[1]]: undefined
  const currentNftContract = useNftContract(project ? project.projectAddress: undefined)

  const [isLoading, setIsLoading] = useState(false)
  const [isApproveLoading, setIsApproveLoading] = useState(false)

  const [error, setError] = useState("")

  const isValid =
    token &&
    project &&
    emailValid &&
    allocationAmountBusdValid &&
    email != undefined &&
    allocationAmountBusd != undefined &&
    email != '' &&
    allocationAmountBusd != '' &&
    new BigNumber(allocationAmountBusd).multipliedBy(1000000000000000000).isLessThanOrEqualTo(token.maxAllocation)

  const displayError = (text: string, time: number) => {
    setError(text)
    setTimeout(() => {
      setError("")
    }, time)
  }

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

  // async function getTokenInfo() {
  //   const tokenInfo = await currentNftContract?.methods.tokensInfo(params.id.split('-')[1]).call()
  //   setToken(tokenInfo)
  // }
  //
  // useEffect(() => {
  //   getTokenInfo()
  // }, [nft])

  const getAllowance = async (): Promise<string> => {
    return await busdContract
      .methods
      // @ts-ignore
      .allowance(account, project.projectAddress)
      .call()
  }

  async function updateAllowance() {
    if (token && project) {
      const newAllowance = await getAllowance()
      setAllowance(newAllowance)
    }
  }

  const approve = async () => {

    if (isApproveLoading) {
      return
    }

    setIsApproveLoading(true)
    const amount2eth = fromExponential(ALLOWANCE);
    try {
      if (token) {
        await busdContract
          .methods
          .approve(project.projectAddress, amount2eth)
          .send({from: account}).once('receipt', () => {
            updateAllowance()
            setIsApproveLoading(false)
          });
      }
    } catch (e) {
      setIsLoading(false)
    }
  };

  const getMinAmountOut = async () => {
    const path = [getBUSDAddress(), getMMProAddress()]
    return new BigNumber((await pancakeRouterContract
      .methods
      .getAmountsOut(allocationAmountBusd, path)
      .call())[1])
  }

  const getDeadline = () => {
    return Math.floor(new Date().getTime() / 1000) + DEADLINE_OVER_NOW;
  }

  async function mintAndAllocate() {
    if (isValid) {
      // const {encryptedEmail} = await encryptEmail(email)
      const tokenId = +params.id.split('-')[1]
      const amountOutMin = (await getMinAmountOut()).multipliedBy(SLIPPAGE_PERCENT).toFixed(0).toString()
      const allocationAmount = (new BigNumber(10).pow(18).multipliedBy(+allocationAmountBusd)).toString()
      const deadline = getDeadline()

      try {
        if (currentNftContract && tokenId.toString() && amountOutMin && allocationAmount && deadline) {
          await currentNftContract
            .methods
            .mintAndAllocate(
              tokenId.toString(),
              amountOutMin,
              deadline,
              allocationAmount,
              []
            ).send({from: account}).once('receipt', () => {
              setBubbleValue("EMPTY")
              setAccentedControlButton(3)
              setIsLoading(false)
              setEmail('')
              setAllowance('')
              collectionContext.setCollectionBubbleValue(collectionContext.bubbleCount + 1)
            });
        }
      } catch (e) {
        console.log(e)
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


    if (project && token && parseInt(token.price.toString()) > parseInt(balance)) {
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

  const isApprovalRequired =  () => token && (parseInt(allowance) < parseInt(token.price.toString()))

  useEffect(() => {
    if (active) {
      updateAllowance()
    }
  }, [active, token, project])

  if (!project || !token) {
    return null
  }

  return (
    <CurrentNFTContainer>
      <MarketplaceHeader title={project.name} redirectTo={`/projects/${project.name}`}/>
      <NFTCardWrapper>
        <BoxShadowShiny>
          <ArtworkImage maxWidth={430} autoPlay loop muted>
            {/*@ts-ignore*/}
            <source src={AllProjects[project.name].nftsCreativeLinks[params.id.split('-')[1]]}/>
          </ArtworkImage>
          <NFTCountForm countOfNFT={token ? (+token.allocationLimit - +token.allocationAmount) : 0}/>
        </BoxShadowShiny>
        <div className="current-nft-form">
          <Text fontWeight={700} fontSize={40} marginBottom={40}>{project.name}</Text>
          <Text fontWeight={700} fontSize={24} marginBottom={20}>{`Base price: ${wei2eth(token?.price)} BUSD`}</Text>
          <Text fontWeight={700} fontSize={24}
                marginBottom={40}>{`Max allocation: ${wei2eth(token?.maxAllocation)} BUSD`}</Text>
          {!account && <Notification body={'Please connect wallet to allocate'}/>}
          {account && isApprovalRequired() &&
            <Button
              textColor={'#fff'}
              background={'#33CC66'}
              onClick={approve}
            >
              Approve
              {isApproveLoading &&
                  <SpinnerContainer>
                    <Spinner color={'white'} size={25}/>
                  </SpinnerContainer>
              }
            </Button>
          }
          {account && !isApprovalRequired() &&
            <>
              <SimpleInput
                onChangeRaw={setEmail}
                isValid={email === "" || emailValid}
                required
                errorTooltipText={'Please enter a correct email'}
                autoComplete="email"
                inputProps={{
                  className: 'w-full',
                  placeholder: 'Email',
                  type: 'email',
                  value: email
                }}
              />
              <SimpleInput
                hasDefaultValueButton
                defaultValueButtonText={'Max'}
                defaultValue={wei2eth(token.maxAllocation).toString()}
                required
                onChangeRaw={setAllocationAmountBusd}
                isValid={allocationAmountBusd === "" || allocationAmountBusdValid}
                // validationFunction={(text) => !isNaN(+text) && text != ''}
                errorTooltipText={'Amount cannot exceed max allocation'}
                inputProps={{
                  className: 'w-full',
                  placeholder: 'Your allocation in BUSD',
                  value: allocationAmountBusd
                }}
              />
              <Button
                marginTop={21}
                textColor={isValid ? '#fff' : 'rgba(255, 255, 255, 0.6)'}
                background={isValid ? '#33CC66' : 'rgba(0, 0, 0, 0.2)'}
                onClick={handleBuy}
              >
                Allocate
                <SpinnerContainer>
                  <Spinner color={'white'} size={isLoading ? 25: 0}/>
                </SpinnerContainer>
              </Button>
            </>
          }
        </div>
      </NFTCardWrapper>
    </CurrentNFTContainer>
  )
};

export default CurrentNFT

