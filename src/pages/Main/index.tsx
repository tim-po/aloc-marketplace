import React, {useContext} from "react";
import './index.css'
import NFTProjectTile from "../../components/NFTProjectTile";
import {useParams} from "react-router-dom";
import ProjectCollection from "../ProjectCollection";
import MarketplaceHeader from "../../components/MarketplaceHeader";
import styled from 'styled-components'
import ProjectsContext from "../../utils/ProjectsContext";
import Spinner from "../../Standard/components/Spinner";

const Wrapper = styled.div`
  max-width: 1088px;
  padding: 0 12px;
`

const Main = () => {
  const params: { projectId: string } = useParams()

  const {projects} = useContext(ProjectsContext)

  if (params.projectId && projects[params.projectId]) {
    const project = projects[params.projectId]
    return <ProjectCollection project={project}/>
  }

  return (
    <div className="Main">
      <MarketplaceHeader/>
      <Wrapper>
        <div className={'projects-flex'}>
          {Object.keys(projects).length ?
            <>
              {Object.keys(projects).map((name) => <NFTProjectTile key={name} project={projects[name]}/>)}
            </>
            :
            <Spinner color={'white'} size={25} />
          }
        </div>
      </Wrapper>
    </div>
  )
};

export default Main

