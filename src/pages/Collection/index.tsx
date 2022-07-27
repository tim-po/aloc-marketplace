import React, {useContext, useEffect, useState} from "react";
import LocaleContext from "../../Standard/LocaleContext";
import './index.css'
import {useAllocationMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import Cross from '../../icons/BigCross'
import styled, {css} from "styled-components";
import CollectionContext from "../../utils/CollectionContext";
import Notification from "../../components/Notification";
import {ArtworkImage, BoxShadowShiny} from "../../components/NFTTile/styled";
import NftProjectContainer from "../../components/NftProjectContainer";
import {useHistory} from "react-router-dom";

const Title = styled.div<{ open: boolean }>`
  font-weight: 700;
  font-size: 40px;
  width: max-content;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0;

  @media screen and (max-width: 900px) {
    transition: all 0.2s;
    width: 100%;
    font-size: 24px;
    transform: scale(0.7) translateX(-28px);

    ${(props) => (props.open && css`
      transform: scale(1) translateX(0);
    `)};
  }
`

const CloseButton = styled.button`
  outline: none !important;
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 25px;
  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 20;


  position: absolute;
  top: 40px;
  right: 40px;

  @media screen and (max-width: 800px) {
    top: 10px;
    right: 20px;
    width: 30px;
    height: 30px;
  }
`

const MobileCollectionOpenButton = styled.button`
  display: none;
  height: 40px;
  outline: none !important;
  padding: 0;
  margin: 0;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 10;

`

const Collection = (props: { isOpen?: boolean }) => {
  const {locale} = useContext(LocaleContext)
  const {isOpen} = props
  const {account, active} = useWeb3React()
  const [allProjects, setAllProjects] = useState<any>({})
  const {setCollectionOpen, collectionOpen} = useContext(CollectionContext)

  const marketplaceContract = useAllocationMarketplaceContract()
  const history = useHistory()

  // async function getUserProjects() {
  //   const NFTArrayFromContract: NFT[] = []
  //
  //   const NFTIdsArray = await marketplaceContract.methods.getNfts(account).call()
  //
  //   for (let i = 0; i < NFTIdsArray.length; i++) {
  //     const newNftData = await marketplaceContract.methods.nftData(NFTIdsArray[i]).call()
  //     NFTArrayFromContract.push(
  //       {
  //         active: true,
  //         allocation: newNftData.allocatedAmount,
  //         limit: 0,
  //         name: newNftData.projectName,
  //         price: newNftData.allocatedAmount,
  //         projectId: newNftData.projectId,
  //         totalBought: 0,
  //         id: NFTIdsArray[i]
  //       }
  //     )
  //   }
  //
  //   const newProjects: ProjectsDict = {}
  //   NFTArrayFromContract.forEach(nft => {
  //     if (newProjects[nft.name]) {
  //       newProjects[nft.name] = [...newProjects[nft.name], nft]
  //     } else {
  //       newProjects[nft.name] = [nft]
  //     }
  //   })
  //   setAllProjects(newProjects)
  // }
  //
  // useEffect(() => {
  //
  // }, [])

  return (
    <div className={`Collection ${isOpen ? '' : 'closed'}`}>
      <MobileCollectionOpenButton onClick={() => setCollectionOpen(true)}/>
      {(collectionOpen || isOpen) &&
        <CloseButton onClick={() => {
          history.replace({search: ''})
          setCollectionOpen(false)
        }}>
          <Cross/>
        </CloseButton>
      }
      <Title open={collectionOpen}>Collection</Title>
      {/*{account ?*/}
      {/*  <>*/}
      {/*    <div className={'projects-flex-collection'}>*/}
      {/*      {Object.keys(allProjects).map((name) => {*/}
      {/*        return (*/}
      {/*          <NftProjectContainer key={name} name={name}>*/}
      {/*            {allProjects[name].map((nft, index) => {*/}
      {/*              return (*/}
      {/*                <BoxShadowShiny key={name + index}>*/}
      {/*                  <ArtworkImage src={mockImage} maxWidth={350}/>*/}
      {/*                  <NFTTransferForm nft={nft}/>*/}
      {/*                </BoxShadowShiny>*/}
      {/*              )*/}
      {/*            })}*/}
      {/*          </NftProjectContainer>*/}
      {/*        )*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*  :*/}
      {/*  <>*/}
      {/*    <div style={{marginTop: 40}} />*/}
      {/*    <Notification body={'Please connect wallet to see the collection'}/>*/}
      {/*  </>*/}
      {/*}*/}
    </div>
  )
};

export default Collection

