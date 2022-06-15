import React, {useContext, useEffect, useState} from "react";
import LocaleContext from "../../Standard/LocaleContext";
import {NFT, ProjectsDict} from "../../types";
import NftProjectContainer from "../../components/NftProjectCointainer";
import './index.css'
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";


const Collection = () => {
    const {locale} = useContext(LocaleContext)
    const {account, active} = useWeb3React()
    const [allProjects, setAllProjects] = useState<ProjectsDict>({})

    const marketplaceContract = useMarketplaceContract()

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
            if(newProjects[nft.name]){
                newProjects[nft.name] = [...newProjects[nft.name], nft]
            }else{
                newProjects[nft.name] = [nft]
            }
        })
        console.log(newProjects)
        setAllProjects(newProjects)
    }

    useEffect(()=>{
        if(active){
            getUserProjects()
        }
    }, [active])

    return (
        <div className="Collection">
            <h1 className={'main-header'}>Your nft collection</h1>
            {account &&
                <>
                    <div className={'projects-flex'}>
                        {Object.keys(allProjects).map(name => {
                            return (
                                <NftProjectContainer dysplayingCollection={true} name={name} nfts={allProjects[name]} />
                            )
                        })}
                    </div>
                </>
            }
        </div>
    )
};

export default Collection

