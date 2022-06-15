import React, {useContext} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import './index.css';
import {localized} from "../../Standard/utils/localized";
import {NFT} from "../../types";
import NFTTileSimple from "../../components/NFTTileSimple";

type ProjectCollectionPropType = {
    name: any
    nfts: any
}

const ProjectCollectionDefaultProps = {
    // somePropWithDefaultOption: 'default value'
}

const ProjectCollection = (props: ProjectCollectionPropType) => {
    const {name} = props
    const {locale} = useContext(LocaleContext)

    const nfts = [
      {active: true, allocation: "1000000000000", limit: "10", name: "test1", price: "10000000000", projectId: 0, totalBought: "5"},
      {active: true, allocation: "1000000000000", limit: "10", name: "test1", price: "10000000000", projectId: 0, totalBought: "5"}
    ]

    return (
        <div className="ProjectCollection">
          <h1 className={'main-header'}>Project {name}</h1>
            <div className={'collection-container'}>
              {localized(texts, locale)}
              {nfts.map(nft => <NFTTileSimple nft={nft} /> )}
            </div>
        </div>
    )
};

ProjectCollection.defaultProps = ProjectCollectionDefaultProps

export default ProjectCollection

