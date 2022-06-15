import React, {useContext, useState} from "react";
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

const mockImage = 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=711&q=80'
const testEmailRegex = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

const INSUFFICIENT_BALANCE_ERROR_MESSAGE = "Insufficient balance";
const TRANSACTION_ERROR_MESSAGE = "Transaction failed";

const ALLOWANCE = 10 ** 10 * 10 ** 18

type CurrentNFTPropType = {
  nft: NFT
}

const CurrentNFTDefaultProps = {
  // somePropWithDefaultOption: 'default value'
}

const CurrentNFT = (props: CurrentNFTPropType) => {
  const {nft} = props
  const {locale} = useContext(LocaleContext)
  const imgRef = React.createRef<HTMLImageElement>()
  const busdContract = useBUSDContract()
  const marketplaceContract = useMarketplaceContract()
  const {account} = useWeb3React()

  const {balance, balanceLoading, updateBalance} = useBalanceOfBUSD()

  const [allowance, setAllowance] = useState<string>('0')
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [emailValid, setEmailValid] = useState(false)
  const [allocationAmountBusd, setAllocationAmountBusd] = useState<string | undefined>(undefined)
  const [allocationAmountBusdValid, setAllocationAmountBusdValid] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")

  const isValid =
    emailValid &&
    allocationAmountBusdValid &&
    email != undefined &&
    allocationAmountBusd != undefined &&
    email != '' &&
    allocationAmountBusd != ''
    // &&
    // new BigNumber(allocationAmountBusd).multipliedBy(1000000000000000000).isLessThanOrEqualTo(nft.allocation)

  const displayError = (text: string, time: number) => {
    setError(text)
    setTimeout(() => {
      setError("")
    }, time)
  }

  async function encryptEmail(email: string): Promise<{encryptedEmail: string}>{
    const encryptEmailURL = 'https://encrypted-email-mmpro.herokuapp.com/encryptEmail'
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    };
    return fetch(encryptEmailURL, requestOptions)
      .then(response => response.json())
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
    const amount2eth = fromExponential(ALLOWANCE);
    await busdContract
      .methods
      .approve(getAllocationMarketplaceContract(), amount2eth)
      .send({from: account}).once('receipt', ()=>{
        updateAllowance()
      });
  };

  async function mintAndAllocate() {
    if(isValid){
      const {encryptedEmail} = await encryptEmail(email)
      await marketplaceContract
        .methods
        .mintAndAllocate(`${nft.projectId}`, `${+allocationAmountBusd * Math.pow(10, 18)}`, encryptedEmail)
        .send({from: account}).once('receipt', ()=>{
          setIsLoading(false)
        });
    }
  }

  const handleBuy = async () => {
    if (isLoading) {
      return
    }

    if (!isValid) {
      return
    }


    if (parseInt(nft.price.toString()) > parseInt(balance)) {
      displayError(INSUFFICIENT_BALANCE_ERROR_MESSAGE, 2000);
      return
    }

    setIsLoading(true)
    try {
      const newAllowance: string = await getAllowance()

      if (parseInt(newAllowance) < parseInt(fromExponential(ALLOWANCE))) {
        await approve()
      }
      await mintAndAllocate()
      await updateBalance()
      setError("")
      // setAmount(amount + 1)
    } catch (e) {
      displayError(TRANSACTION_ERROR_MESSAGE, 2000)
      console.log({error: e})
    }
    setIsLoading(false)

  }

  const isApprovalRequired = (parseInt(allowance) < parseInt(fromExponential(ALLOWANCE)))

  return (
    <div className="CurrentNFT">
      <div className="nft-container">
        {localized(texts, locale)}
        <img ref={imgRef} src={mockImage} className="current-nft-img"/>
        <div className="current-nft-form">
          <h1 className={'main-header'}>Muhtar collection</h1>
          <div className={'nft-price'} style={{marginBottom: 2}}>{`Base price: 200 BUSD`}</div>
          <div>{`Max allocation: 11000 BUSD`}</div>
          <>
            <SimpleValidatedInput
              className="w-full"
              onChange={(e) => setEmail(e.target.value)}
              onValidationChange={(isValid) => setEmailValid(isValid)}
              validationFunction={(text) => testEmailRegex.test(text)}
              errorTooltipText={'Please enter a correct email'}
              placeholder="Email"
              type="email"
            />
            <SimpleValidatedInput
              hasDefaultValueButton
              defaultValueButtonText={'Max'}
              // defaultValue={wei2eth(nft.allocation).toString()}
              shouldValidateOnInput
              className="w-full"
              placeholder="Your allocation in BUSD"
              onChange={(e) => setAllocationAmountBusd(e.target.value)}
              onValidationChange={(isValid) => setAllocationAmountBusdValid(isValid)}
              validationFunction={(text) => !isNaN(+text) && text != ''}
              errorTooltipText={'Please enter a number'}
            />
          </>
          <button className={`allocate-button ${isValid ? '' : 'not-valid'}`}
                  onClick={() => handleBuy()}>
            {isApprovalRequired ? 'Approve' : 'Allocate'} {isLoading ?
            <div className={'spinner-container'}><Spinner color={'white'} size={25}/></div> : null}
          </button>
        </div>
      </div>
    </div>
  )
};

CurrentNFT.defaultProps = CurrentNFTDefaultProps

export default CurrentNFT

