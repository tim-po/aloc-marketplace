import React from "react";
import './index.css';
import {NFT} from "../../types";
import NFTTileSimple from "../../components/NFTTileSimple";

type ProjectCollectionPropType = {
    name: any
    nfts: NFT[]
}

const ProjectCollection = (props: ProjectCollectionPropType) => {
    const {name, nfts} = props

    console.log(nfts)

    return (
        <div className="ProjectCollection">
          <h1 className={'main-header'}>Project {name}</h1>
            <div className={'collection-container'}>
              {nfts.map((nft) => <NFTTileSimple nft={nft} /> )}
            </div>
        </div>
    )
};

export default ProjectCollection

