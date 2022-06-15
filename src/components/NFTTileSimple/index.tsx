import React, {useContext, useEffect, useState} from "react";
import LocaleContext from "../../Standard/LocaleContext";
import './index.css'
import {wei2eth} from "../../Standard/utils/common";
import SimpleValidatedInput from "../SimpleValidatedInput";
// CONSTANTS
const mockImage = 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=711&q=80'

// DEFAULT FUNCTIONS

type NFTTilePropType = {
    // You should declare props like this, delete this if you don't need props
    nft: any,
}

const NFTTileDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
}

const NFTTileSimple = (props: NFTTilePropType) => {
    const {nft} = props
    const {locale} = useContext(LocaleContext)
    const imgRef = React.createRef<HTMLImageElement>()

    return (
        <>
            <div
                className={'NFTTileSimple'}
                style={{position: 'relative'}}
            >
              <img ref={imgRef} className={'nft-artwork-simple'} src={mockImage}/>
              <div
                className={`nft-data-simple `}
              >
                <div className={'nft-price'} style={{marginBottom: 2}}>{`Base price: ${wei2eth(nft.price)} BUSD`}</div>
                <div>{`Max allocation: ${wei2eth(nft.allocation)} BUSD`}</div>
              </div>
            </div>
        </>
    )
};

NFTTileSimple.defaultProps = NFTTileDefaultProps

export default NFTTileSimple