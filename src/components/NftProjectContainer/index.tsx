import React, {ReactChild} from "react";
import './index.css'
import {NFT} from "../../types";


type NftProjectCointainerPropType = {
  name: string,
  children: ReactChild | ReactChild[]
}

const NftProjectCointainerDefaultProps = {}

const NftProjectContainer = (props: NftProjectCointainerPropType) => {
  const {name, children} = props

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