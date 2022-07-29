import React from 'react';
import {ProjectsDict} from "../types";

const ProjectContext = React.createContext<{setProjects: (newProjects: ProjectsDict)=>void, projects: ProjectsDict}>({
    setProjects: (newProjects: ProjectsDict) => {},
    projects: {}
  }
);

export default ProjectContext;
