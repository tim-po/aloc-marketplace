import React, {useContext, useEffect, useState} from "react";
import LocaleContext from "../../Standard/LocaleContext";
import {NFT, ProjectsDict} from "../../types";
import NFTTileWithForm from "../../components/NFTTileWithForm";
import NFTTransferForm from "../../components/NFTTransferForm";
import './index.css'
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import Cross from '../../icons/BigCross'
import styled, {css} from "styled-components";
import CollectionContext from "../../utils/CollectionContext";
import Notification from "../../components/Notification";

const Title = styled.div<{ open: boolean }>`
  font-weight: 700;
  font-size: 40px;
  width: max-content;
  margin: auto;
  margin-top: 0;
  margin-bottom: 80px;

  @media screen and (max-width: 800px) {
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

  @media screen and (max-width: 800px) {
    display: block;
  }
`

const Collection = () => {
  const {locale} = useContext(LocaleContext)
  const {account, active} = useWeb3React()
  const [allProjects, setAllProjects] = useState<ProjectsDict>({})
  const {setCollectionOpen, collectionOpen} = useContext(CollectionContext)

  const marketplaceContract = useMarketplaceContract()

  async function getUserProjects() {
    const NFTArrayFromContract: NFT[] = []

    const NFTIdsArray = await marketplaceContract.methods.getNfts(account).call()

    for (let i = 0; i < NFTIdsArray.length; i++) {
      const newNftData = await marketplaceContract.methods.nftData(NFTIdsArray[i]).call()
      NFTArrayFromContract.push(
        {
          active: true,
          allocation: newNftData.allocatedAmount,
          limit: 0,
          name: 'test',
          price: newNftData.allocatedAmount,
          projectId: newNftData.projectId,
          totalBought: 0,
          id: NFTIdsArray[i]
        }
      )
    }

    const newProjects: ProjectsDict = {}
    NFTArrayFromContract.forEach(nft => {
      if (newProjects[nft.name]) {
        newProjects[nft.name] = [...newProjects[nft.name], nft]
      } else {
        newProjects[nft.name] = [nft]
      }
    })
    setAllProjects(newProjects)
  }

  useEffect(() => {
    if (active) {
      getUserProjects()
    }
  }, [active, allProjects])

  return (
    <div className="Collection">
      <MobileCollectionOpenButton onClick={() => setCollectionOpen(true)}/>
      {collectionOpen &&
        <CloseButton onClick={() => setCollectionOpen(false)}>
          <Cross/>
        </CloseButton>
      }
      <Title open={collectionOpen}>Collection</Title>
      {account ?
        <>
          <div className={'projects-flex'}>
            {Object.keys(allProjects).map((name) => {
              return (
                <>
                  {allProjects[name].map(nft => {
                    return (
                      <div style={{width: 380}}>
                        <NFTTileWithForm key={name} imageHeight={320} imageWidth={340}>
                          <NFTTransferForm nft={nft}/>
                        </NFTTileWithForm>
                      </div>
                    )
                  })}
                </>
              )
            })}
          </div>
        </>
        :
        <Notification body={'Please connect wallet to see the collection'}/>
      }
    </div>
  )
};

export default Collection

