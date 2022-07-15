import React, {useContext, useEffect, useState} from "react";
import {NFT, ProjectsDict} from "../../types";
import './index.css'
import {useMarketplaceContract} from "../../hooks/useMarketplaceContract";
import {useWeb3React} from "@web3-react/core";
import NFTProjectTile from "../../components/NFTProjectTile";
import {useParams} from "react-router-dom";
import ProjectCollection from "../ProjectCollection";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import styled from 'styled-components'
import CollectionContext from "../../utils/CollectionContext";

const Wrapper = styled.div`
  max-width: 1088px;
`

const Main = () => {
    const [allProjects, setAllProjects] = useState<ProjectsDict>({})
    const params: {projectId: string} = useParams()

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

    if(params.projectId){
        const project = allProjects[params.projectId]
        return <ProjectCollection name={params.projectId} nfts={project} />
    }

    return (
        <div className="Main">
          <MarketplaceHeader />
          <Wrapper>
            <div className={'projects-flex'}>
              {Object.keys(allProjects).map((name) => {
                return (
                  <NFTProjectTile key={name} project={allProjects[name]} />
                )
              })}
            </div>
          </Wrapper>
        </div>
    )
};

export default Main

