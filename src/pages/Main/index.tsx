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
import IosStyleSegmentedControll from "../../components/IosStyleSegmentedControll";
import {useWeb3} from "../../Standard/hooks/useCommonContracts";

// CONSTANTS

const mockNfts = [
    {
        "name": "ZimaBanc",
        "price": new BigNumber(15 * Math.pow(10, 18)),
        "allocation":  new BigNumber(40 * Math.pow(10, 18)),
        "limit": 40,
        "totalBought": 20,
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
        "limit": 5,
        "totalBought": 1,
        "active": true,
    }
]

const Main = () => {
    const {locale} = useContext(LocaleContext)
    const {account} = useWeb3React()
    const [allProjects, setAllProjects] = useState<ProjectsDict>({})
    const [allProjectsById, setAllProjectsById] = useState<{[key: string]: string}>({})
    const [allNFTs, setAllNFTs] = useState<NFT[]>([])

    const [dysplayingCollection, setDysplayingCollection] = useState(false)

    // const [projectBalance, setProjectBalance] = useState<number>(0)
    const [currentNFTData, setCurrentNFTData] = useState()
    const marketplaceContract = useMarketplaceContract()
    const web3 = useWeb3();

    async function getNftData(id: number) {
      const nftData = await marketplaceContract.methods.nftData(id, account).call()
      setCurrentNFTData(nftData)
    }

    async function mintAndAllocate(projectId: number, amount: number, email: string) {
      await marketplaceContract.methods.mintAndAllocate(projectId, amount, email).send({from: account})
    }

    async function getAllProjects(){
        const NFTArrayFromContract: NFT[] = []
        const newProjectsById: {[key: string]: string} = {}
        for (let i = 0; i < 99999; i++) {
            let newProject: NFT
            try {
                newProject = {...(await marketplaceContract.methods.projects(i).call()), projectId: i}
            } catch {
                break
            }
            newProjectsById[i] = newProject.name
            NFTArrayFromContract.push(newProject)
        }

        setAllProjectsById(newProjectsById)
        // const NFTArrayFromContract = [...mockNfts]
        //     // await marketplaceContract.methods.projects(id).call()

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

    async function getUserProjects(){
        const NFTArrayFromContract: NFT[] = []

        const NFTIdsArray = await marketplaceContract.methods.getNfts(account).call()

        for (let i = 0; i < NFTIdsArray.length; i++) {
            const newNftData = await marketplaceContract.methods.nftData(NFTIdsArray[i]).call()
            NFTArrayFromContract.push(
                {
                    active: true,
                    allocation: newNftData.allocatedAmount,
                    limit: 0,
                    name: allProjectsById[newNftData.projectId],
                    price: newNftData.allocatedAmount,
                    projectId: newNftData.projectId,
                    totalBought: 0,
                    id: NFTIdsArray[i]
                }
            )
        }

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
            <IosStyleSegmentedControll
                buttons={['Allocation marketplace', 'My collection']}
                width={600}
                firstSelectedIndex={0}
                onChange={(index)=>{
                    if(index === 0){
                        setDysplayingCollection(false)
                        getAllProjects()
                    }else{
                        setDysplayingCollection(true)
                        getUserProjects()
                    }
                }}
            />
            <div className={'projects-flex'}>
                {Object.keys(allProjects).map(name => {
                    return (
                        <NftProjectContainer dysplayingCollection={dysplayingCollection} name={name} nfts={allProjects[name]} />
                    )
                })}
            </div>
        </div>
    )
};

export default Main

