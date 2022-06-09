import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import {NFT} from "../../types";
import {wei2eth} from "../../Standard/utils/common";
import FastAverageColor from "fast-average-color";
import SimpleValidatedInput from "../SimpleValidatedInput";
import {isNumber} from "lodash";
import Spinner from "../../Standard/components/Spinner";

// CONSTANTS
const mockImage = 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=711&q=80'
const testEmailRegex = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

// DEFAULT FUNCTIONS

type NFTTilePropType = {
    // You should declare props like this, delete this if you don't need props
    nft: NFT
}

const NFTTileDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
}

const NFTTile = (props: NFTTilePropType) => {
    const {nft} = props
    const {locale} = useContext(LocaleContext)
    const imgRef = React.createRef<HTMLImageElement>()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isFormForcedOpen, setIsFormForcedOpen] = useState(false)

    const [email, setEmail] = useState<string | undefined>(undefined)
    const [emailValid, setEmailValid] = useState(false)

    const [allocationAmountBusd, setAllocationAmountBusd] = useState<string | undefined>(undefined)
    const [allocationAmountBusdValid, setAllocationAmountBusdValid] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const isValid =
        emailValid &&
        allocationAmountBusdValid &&
        email != undefined &&
        allocationAmountBusd != undefined &&
        email != '' &&
        allocationAmountBusd != ''

    function allocate() {
        if(isValid){
            setIsLoading(true)
            setTimeout(()=>{
                setIsLoading(false)
            }, 1000)
        }
    }

    function resetOpen() {
        setIsFormOpen(false)
        setIsFormForcedOpen(false)
    }

    return (
        <>
            <div
                className={'NFTTile'}
                style={{position: 'relative'}}
            >
                <img ref={imgRef} className={'nft-artwork'} src={mockImage}/>
                <div
                    className={`nft-data ${isFormOpen ? 'open': ''}`}
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
                    <div className={'nft-price'}>{`${wei2eth(nft.price)} BUSD`}</div>
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
                    <SimpleValidatedInput
                        shouldValidateOnInput
                        className="w-full"
                        placeholder="Your allocation in BUSD"
                        onChange={(e) => setAllocationAmountBusd(e.target.value)}
                        onValidationChange={(isValid) => setAllocationAmountBusdValid(isValid)}
                        validationFunction={(text) => !isNaN(+text) && text != ''}
                        errorTooltipText={'Please enter a number'}
                    />
                    <button className={`allocate-button ${isValid ? '': 'not-valid'}`} onClick={allocate}>
                        Allocate {isLoading ? <div className={'spinner-container'}><Spinner color={'white'} size={25}/></div>: null}
                    </button>
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