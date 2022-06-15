import React, {useEffect, useState} from "react";
import {NFT, ProjectsDict} from "../../types";
import NftProjectContainer from "../../components/NftProjectCointainer";
import './index.css'
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import NFTProjectTile from "../../components/NFTProjectTile";


const Main = () => {
    const {account} = useWeb3React()
    const [allProjects, setAllProjects] = useState<ProjectsDict>({})

    const marketplaceContract = useMarketplaceContract()

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
            <h1 className={'main-header'}>NFT Marketplace</h1>
            {account &&
                <>
                    <div className={'projects-flex'}>
                        {Object.keys(allProjects).map(name => {
                            return (
                                <NFTProjectTile project={name} />
                            )
                        })}
                    </div>
                </>
            }
        </div>
    )
};

export default Main

