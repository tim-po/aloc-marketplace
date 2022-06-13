import React, {useContext, useEffect, useState} from "react";
import LocaleContext from "../../Standard/LocaleContext";
import './index.css'
import {NFT} from "../../types";
import {wei2eth} from "../../Standard/utils/common";
import SimpleValidatedInput from "../SimpleValidatedInput";
import Spinner from "../../Standard/components/Spinner";
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import {useBUSDContract} from "../../Standard/hooks/useCommonContracts";
import {useBalanceOfBUSD} from "../../hooks/useBalance";
import fromExponential from "from-exponential";
import BigNumber from "bignumber.js";
import {getAllocationMarketplaceContract} from "../../utils/getAddress";

// CONSTANTS
const mockImage = 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=711&q=80'
const testEmailRegex = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
const testAdressRegex = /0x*/g;

const INSUFFICIENT_BALANCE_ERROR_MESSAGE = "Insufficient balance";
const TRANSACTION_ERROR_MESSAGE = "Transaction failed";

const DEADLINE_OVER_NOW = 60 * 5 // 5 min
const ALLOWANCE = 10 ** 10 * 10 ** 18

// DEFAULT FUNCTIONS

type NFTTilePropType = {
    // You should declare props like this, delete this if you don't need props
    nft: NFT,
    dysplayingCollection: boolean,
}

const NFTTileDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
}

const NFTTile = (props: NFTTilePropType) => {
    const {nft, dysplayingCollection} = props
    const {account} = useWeb3React()
    const {locale} = useContext(LocaleContext)
    const imgRef = React.createRef<HTMLImageElement>()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isFormForcedOpen, setIsFormForcedOpen] = useState(false)
    const marketplaceContract = useMarketplaceContract()
    const busdContract = useBUSDContract()

    const {balance, balanceLoading, updateBalance} = useBalanceOfBUSD()

    const [email, setEmail] = useState<string | undefined>(undefined)
    const [emailValid, setEmailValid] = useState(false)
    const [allowance, setAllowance] = useState<string>('0')

    const [transferAdress, setTransferAdress] = useState<string | undefined>(undefined)
    const [transferAdressValid, setTransferAdressValid] = useState(false)

    const [allocationAmountBusd, setAllocationAmountBusd] = useState<string | undefined>(undefined)
    const [allocationAmountBusdValid, setAllocationAmountBusdValid] = useState(false)

    const [error, setError] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const isValid =
        emailValid &&
        allocationAmountBusdValid &&
        email != undefined &&
        allocationAmountBusd != undefined &&
        email != '' &&
        allocationAmountBusd != '' &&
        new BigNumber(allocationAmountBusd).multipliedBy(1000000000000000000).isLessThanOrEqualTo(nft.allocation)

    const isValidForTransfer =
        transferAdressValid &&
        transferAdress !== '' &&
        nft.id

    const displayError = (text: string, time: number) => {
        setError(text)
        setTimeout(()=>{
            setError("")
        }, time)
    }

    const getAllowance = async (): Promise<string> => {
        return await busdContract
            .methods
            .allowance(account, getAllocationMarketplaceContract())
            .call()
    }

    async function updateAllowance() {
        const newAllowance = await getAllowance()
        console.log('newAllowance')
        console.log(newAllowance)
        setAllowance(newAllowance)
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

    async function mintAndAllocate() {
        if(isValid){
            const {encryptedEmail} = await encryptEmail(email)
            console.log(encryptedEmail)
            await marketplaceContract
                .methods
                .mintAndAllocate(`${nft.projectId}`, `${+allocationAmountBusd * Math.pow(10, 18)}`, encryptedEmail)
                .send({from: account}).once('receipt', ()=>{
                    setIsLoading(false)
                });
        }
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

    const handleBuy = async () => {
        if (isLoading){
            return
        }

        if(!isApprovalRequired && !isValid){
            return
        }

        setIsFormForcedOpen(true)

        if (parseInt(nft.price.toString()) > parseInt(balance)) {
            displayError(INSUFFICIENT_BALANCE_ERROR_MESSAGE, 2000);
            return
        }

        setIsLoading(true)
        try {
            const newAllowance: string = await getAllowance()

            console.log(newAllowance)

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

    useEffect(()=>{
        updateAllowance()
    }, [])


    function transfer() {
        if(isValidForTransfer){
            setIsLoading(true)
            marketplaceContract.methods.safeTransferFrom(account, transferAdress, `${nft.id}`, '1', '0x0')
                .send({from: account})
                .once('receipt', ()=>{
                    setIsLoading(false)
                })
        }
    }

    function resetOpen() {
        setIsFormOpen(false)
        setIsFormForcedOpen(false)
    }

    if((nft.limit - nft.totalBought === 0 || !nft.active) && !dysplayingCollection){
        return null
    }
    const isApprovalRequired = (parseInt(allowance) < parseInt(fromExponential(ALLOWANCE)))

    return (
        <>
            <div
                className={'NFTTile'}
                style={{position: 'relative'}}
            >
                <img ref={imgRef} className={'nft-artwork'} src={mockImage}/>
                {!dysplayingCollection &&
                    <div className={'nft-left'}>{`Only ${nft.limit - nft.totalBought} left`}</div>
                }
                <div
                    className={`nft-data ${dysplayingCollection ? 'collection': ''} ${isFormOpen ? 'open': ''}`}
                    onMouseEnter={() => setIsFormOpen(true)}
                    onMouseLeave={() => {
                        if(!isFormForcedOpen){
                            setIsFormOpen(false)
                        }
                    }}
                >
                    <button className={'force-close-button'} onClick={()=> resetOpen()}>
                        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect style={{transition: 'all 0.2s'}} x="1" y="1.63604" width="2" height={isFormForcedOpen ? "15": "0"} rx="1" transform="rotate(-45 1 1.63604)" fill="white"/>
                            <rect style={{transition: 'all 0.2s'}} width="2" height={isFormForcedOpen ? "15": "0"} rx="1" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 13 1.63604)" fill="white"/>
                        </svg>
                    </button>
                    {dysplayingCollection &&
                        <>
                            <div className={'nft-price'}>{`Your allocation: ${wei2eth(nft.price)} BUSD`}</div>
                        </>
                    }
                    {!dysplayingCollection &&
                        <>
                        <div className={'nft-price'} style={{marginBottom: 2}}>{`Base price: ${wei2eth(nft.price)} BUSD`}</div>
                        <div className={'nft-price'} style={{fontSize: 14}}>{`Max allocation: ${wei2eth(nft.allocation)} BUSD`}</div>
                        </>
                    }
                    {dysplayingCollection &&
                        <>
                            <SimpleValidatedInput
                                className="w-full"
                                onFocus={() => {
                                    setIsFormForcedOpen(true)
                                    setIsFormOpen(true)
                                }}
                                onChange={(e) => setTransferAdress(e.target.value)}
                                onValidationChange={(isValid) => setTransferAdressValid(isValid)}
                                validationFunction={(text) => testAdressRegex.test(text)}
                                errorTooltipText={'Please enter a correct address'}
                                placeholder="Transfer address"
                            />
                        </>
                    }
                    {!dysplayingCollection &&
                        <>
                            <SimpleValidatedInput
                                className="w-full"
                                onFocus={() => {
                                    setIsFormForcedOpen(true)
                                    setIsFormOpen(true)
                                }}
                                onChange={(e) => setEmail(e.target.value)}
                                onValidationChange={(isValid) => setEmailValid(isValid)}
                                validationFunction={(text) => testEmailRegex.test(text)}
                                errorTooltipText={'Please enter a correct email'}
                                placeholder="Email"
                                type="email"
                            />
                            {/*<div className={'nft-price'}>{`Max allocation: ${wei2eth(nft.allocation)} BUSD`}</div>*/}
                            <SimpleValidatedInput
                                hasDefaultValueButton
                                defaultValueButtonText={'Max'}
                                defaultValue={wei2eth(nft.allocation).toString()}
                                shouldValidateOnInput
                                className="w-full"
                                placeholder="Your allocation in BUSD"
                                onFocus={() => {
                                    setIsFormForcedOpen(true)
                                    setIsFormOpen(true)
                                }}
                                onChange={(e) => setAllocationAmountBusd(e.target.value)}
                                onValidationChange={(isValid) => setAllocationAmountBusdValid(isValid)}
                                validationFunction={(text) => !isNaN(+text) && text != ''}
                                errorTooltipText={'Please enter a number'}
                            />
                        </>
                    }
                    {dysplayingCollection &&
                        <button className={`allocate-button ${isValid ? '': 'not-valid'}`} onClick={transfer}>
                            Transfer {isLoading ? <div className={'spinner-container'}><Spinner color={'white'} size={25}/></div>: null}
                        </button>
                    }
                    {!dysplayingCollection &&
                        <button className={`allocate-button ${(isValid || isApprovalRequired) ? '': 'not-valid'}`} onClick={() => handleBuy()}>
                            {isApprovalRequired ? 'Approve': 'Allocate'} {isLoading ? <div className={'spinner-container'}><Spinner color={'white'} size={25}/></div>: null}
                        </button>
                    }
                </div>
                <button
                    onClick={() => {
                        setIsFormForcedOpen(true)
                        setIsFormOpen(true)
                    }}
                    className={'nft-card-button'}
                />
            </div>
        </>
    )
};

NFTTile.defaultProps = NFTTileDefaultProps

export default NFTTile