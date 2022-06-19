import React, {useContext} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

type ProjectTilePropType = {
    // You should declare props like this, delete this if you don't need props
    someProp: any
    somePropWithDefaultOption?: string
}

const ProjectTileDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
    somePropWithDefaultOption: 'default value'
}

const ProjectTile = (props: ProjectTilePropType) => {
    const {locale} = useContext(LocaleContext)

    return (
        <div className={'ProjectTile'}>
            {/* example of localisation usage */}
            <div>
                {localized(texts, locale)}
            </div>
        </div>
    )
};

ProjectTile.defaultProps = ProjectTileDefaultProps

export default ProjectTile