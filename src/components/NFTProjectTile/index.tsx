import React from "react";
import './index.css'
import {useHistory} from "react-router-dom";

// CONSTANTS
const mockImage = 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=711&q=80'

type NFTTilePropType = {
    // You should declare props like this, delete this if you don't need props
    project: string,
}

const NFTProjectTile = (props: NFTTilePropType) => {
    const {project} = props
    const imgRef = React.createRef<HTMLImageElement>()
    const history = useHistory();

    return (
        <>
            <div
                className={'NFTProjectTile'}
                style={{position: 'relative'}}
            >
                <img ref={imgRef} className={'nft-project-artwork'} src={mockImage}/>
                <div className={'nft-project-name'}>{`Project: ${project}`}</div>
                <button
                    onClick={() => {
                        history.push(`/projects/${project}`)
                    }}
                    className={'nft-card-button'}
                />
            </div>
        </>
    )
};

export default NFTProjectTile