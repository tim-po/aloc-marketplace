import React, {useEffect, useState} from "react";
import Spinner from "../common/Spinner";
import {wei2eth} from "../../utils/common";
import {useAllocationMarketplaceContract, useBUSDContract, usePancakeRouterContract} from "../../hooks/useContracts";
import fromExponential from "from-exponential";
import {getAllocationMarketplaceAddress, getBUSDAddress, getMMProAddress} from "../../utils/getAddress";
import {useWeb3React} from "@web3-react/core";
import './index.css'
import {HidingText} from "../HidingText";


const INSUFFICIENT_BALANCE_ERROR_MESSAGE = "Insufficient balance";
const TRANSACTION_ERROR_MESSAGE = "Transaction failed";

const DEADLINE_OVER_NOW = 60 * 5 // 5 min
const ALLOWANCE = 10 ** 10 * 10 ** 18

const allocationValues = ['500', '2,000', '5,000', '10,000', '50,000']

export const AllocationItem = ({tier, price, initAmount, updateBalance, balance}) => {
    const {account} = useWeb3React();

    const allocationMarketplaceContract = useAllocationMarketplaceContract();
    const pancakeRouterContract = usePancakeRouterContract();
    const BUSDContract = useBUSDContract()
    const [amount, setAmount] = useState(initAmount)
    const [loadingBuy, setLoadingBuy] = useState(false)
    const [error, setError] = useState("")
    const [allocationLimit, setAllocationLimit] = useState(0)
    const [allocatedAmount, setAllocatedAmount] = useState(0)

    useEffect( () => {
        allocationMarketplaceContract
            .methods
            .allocationLimit(tier)
            .call()
            .then(limit => setAllocationLimit(limit))
        allocationMarketplaceContract
            .methods
            .allocatedAmount(tier)
            .call()
            .then(amount => setAllocatedAmount(amount))
    })

    const displayError = (text, time) => {
        setError(text)
        setTimeout(()=>{
            setError("")
        }, time)
    }

    const getMinAmountOut = async () => {
        const path = [getBUSDAddress(), getMMProAddress()]
        return (await pancakeRouterContract
            .methods
            .getAmountsOut(price, path)
            .call())[1]
    }

    const getDeadline = () => {
        return Math.floor(new Date().getTime() / 1000) + DEADLINE_OVER_NOW;
    }

    const getAllowance = async () => {
        return await BUSDContract
            .methods
            .allowance(account, getAllocationMarketplaceAddress())
            .call();
    }

    const approve = async () => {
        const amount2eth = fromExponential(ALLOWANCE);
        await BUSDContract
            .methods
            .approve(getAllocationMarketplaceAddress(), amount2eth)
            .send({from: account});
    };

    const mint = async () => {
        await allocationMarketplaceContract
            .methods
            .mint(tier, await getMinAmountOut(), getDeadline())
            .send({from: account})
    }

    const handleBuy = async () => {
        if (loadingBuy){
            return
        }

        if (parseInt(price) > parseInt(balance)) {
            displayError(INSUFFICIENT_BALANCE_ERROR_MESSAGE, 2000);
            return
        }

        setLoadingBuy(true)
        try {
            const allowance = await getAllowance()
            if (parseInt(price) > parseInt(allowance)) {
                await approve()
            }
            await mint()
            await updateBalance()
            setError("")
            setAmount(amount + 1)
        } catch (e) {
            displayError(TRANSACTION_ERROR_MESSAGE, 2000)
            console.log({error: e})
        }
        setLoadingBuy(false)

    }

    const videoRef = React.createRef();

    useEffect(()=>{
        if(videoRef.current){
            videoRef.current.playbackRate = 0.7;
        }
    }, [videoRef])

    return (
        <div
            className={'staking-element rounded-lg'}>
            <div className={`nft-video-container rounded-lg ${amount > 0 && `border-t-${tier + 1}`}`}>
              <video className={'nft-video rounded-lg '} ref={videoRef} autoPlay loop muted>
                  <source src={`/videoBackgrounds/Render_Tier${tier + 1}.webm`} type="video/webm" />
              </video>
                {price !== undefined &&
                <div className={'price'}>
                    <div style={{fontSize: 22}}>
                        Allocation up to <b>{allocationValues[tier]}$</b>
                    </div>
                    <div style={{fontSize: 17}}>
                        Price: {wei2eth(price)} BUSD
                    </div>
                </div>
                }
                {amount === 0 &&
                <button
                  onClick={handleBuy}
                  className={`buy-button ${(loadingBuy || error !== "") && 'paywall'} rounded-lg text-2xl`}
                  disabled={loadingBuy}
                >
                    {loadingBuy ? (
                      <Spinner size={25} color={'#FFFFFF'}/>
                    ) : (
                      <HidingText defaultText={'Buy'} hidingText={error}
                                  peekOut={error !== ""}/>
                    )}
                </button>
                }
            </div>
            <br/>
            <br/>
            <br/>
            <div>
                <h3>limit: {allocationLimit}</h3>
                <h3>total owned amount: {allocatedAmount}</h3>
            </div>
        </div>
    )

}