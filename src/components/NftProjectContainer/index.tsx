import React, {ReactChild, useContext} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import {NFT} from "../../types";

// CONSTANTS

// DEFAULT FUNCTIONS

type NftProjectCointainerPropType = {
  // You should declare props like this, delete this if you don't need props
  name: string,
  children: ReactChild | ReactChild[]
  // somePropWithDefaultOption?: string
}

const NftProjectCointainerDefaultProps = {
  // You should declare default props like this, delete this if you don't need props
  // somePropWithDefaultOption: 'default value'
}

const NftProjectContainer = (props: NftProjectCointainerPropType) => {
  const {name, children} = props
  const {locale} = useContext(LocaleContext)

  return (
    <div className={'NftProjectCointainer'}>
      <h3 className={'project-header'}>{name}</h3>
      <div className={'nfts-flex'}>
        {children}
      </div>
    </div>
  )
};

NftProjectContainer.defaultProps = NftProjectCointainerDefaultProps

export default NftProjectContainer