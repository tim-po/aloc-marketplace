import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import {BigNumber} from "bignumber.js";
import {NFT, ProjectsDict} from "../../types";
import NftProjectContainer from "../../components/NftProjectCointainer";
import './index.css'
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";

// CONSTANTS

const mockNfts = [
    {
        "name": "ZimaBanc",
        "price": new BigNumber(15 * Math.pow(10, 18)),
        "allocation":  new BigNumber(40 * Math.pow(10, 18)),
        "limit": 40,
        "totalBought": 40,
        "active": true,
    },
    {
        "name": "ZimaBanc",
        "price":  new BigNumber(25 * Math.pow(10, 18)),
        "allocation":  new BigNumber(50 * Math.pow(10, 18)),
        "limit": 10,
        "totalBought": 8,
        "active": true,
    },
    {
        "name": "ZimaBanc",
        "price":  new BigNumber(50 * Math.pow(10, 18)),
        "allocation": new BigNumber(100 * Math.pow(10, 18)),
        "limit": 5,
        "totalBought": 3,
        "active": true,
    },
    {
        "name": "Sklazer LLC",
        "price": new BigNumber(10 * Math.pow(10, 18)),
        "allocation": new BigNumber(20 * Math.pow(10, 18)),
        "limit": 5,
        "totalBought": 3,
        "active": true,
    },
    {
        "name": "Sklazer LLC",
        "price": new BigNumber(100 * Math.pow(10, 18)),
        "allocation": new BigNumber(300 * Math.pow(10, 18)),
        "limit": 1,
        "totalBought": 1,
        "active": true,
    }
]

const Main = () => {
    const {locale} = useContext(LocaleContext)
    const {account} = useWeb3React()
    const [allProjects, setAllProjects] = useState<ProjectsDict>({})
    const [allNFTs, setAllNFTs] = useState<NFT[]>([])
    const [projectBalance, setProjectBalance] = useState<number>(0)
    const [currentNFTData, setCurrentNFTData] = useState()
    const marketplaceContract = useMarketplaceContract()

    async function getProjectBalance(id: number) {
      const projectBalance = await marketplaceContract.methods.balanceOf(account, id).call()
      setProjectBalance(projectBalance)
    }

    async function getNftData(id: number) {
      const nftData = await marketplaceContract.methods.nftData(id, account).call()
      setCurrentNFTData(nftData)
    }

    async function mintAndAllocate(projectId: number, amount: number, email: string) {
      await marketplaceContract.methods.mintAndAllocate(projectId, amount, email).send({from: account})
    }


    function getAllProjects(){
        const NFTArrayFromContract = [...mockNfts]

        setAllNFTs(NFTArrayFromContract)
        const newProjects: ProjectsDict = {}
        NFTArrayFromContract.forEach(nft => {
            if(newProjects[nft.name]){
                newProjects[nft.name] = [...newProjects[nft.name], nft]
            }else{
                newProjects[nft.name] = [nft]
            }
        })
        setAllProjects(newProjects)
    }

    useEffect(()=>{
        getAllProjects()
    }, [])

    return (
        <div className="Main">
            <h1 className={'main-header'}>Your nft allocation tool</h1>
            <div className={'projects-flex'}>
                {Object.keys(allProjects).map(name => {
                    return (
                        <NftProjectContainer name={name} nfts={allProjects[name]} />
                    )
                })}
            </div>
        </div>
    )
};

export default Main

