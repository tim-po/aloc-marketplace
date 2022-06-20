import React, {useContext} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import {NFT} from "../../types";
import NFTTile from "../NFTTile";
// CONSTANTS

// DEFAULT FUNCTIONS

type NftProjectCointainerPropType = {
    // You should declare props like this, delete this if you don't need props
    dysplayingCollection: boolean,
    name: string,
    nfts: NFT[]
    // somePropWithDefaultOption?: string
}

const NftProjectCointainerDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
    // somePropWithDefaultOption: 'default value'
}

const NftProjectContainer = (props: NftProjectCointainerPropType) => {
    const {nfts, name, dysplayingCollection} = props
    const {locale} = useContext(LocaleContext)
  console.log(nfts)
    return (
        <div className={'NftProjectCointainer'}>
            <h3 className={'project-header'}>{name}</h3>
            <div className={'nfts-flex'}>
                {nfts.map(nft => (
                    <NFTTile key={`${nft.name}-${nft.price}`} dysplayingCollection={dysplayingCollection} nft={nft} />
                ))}
            </div>
        </div>
    )
};

NftProjectContainer.defaultProps = NftProjectCointainerDefaultProps

export default NftProjectContainer