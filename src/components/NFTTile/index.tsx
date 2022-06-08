import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import {NFT} from "../../types";
import {wei2eth} from "../../Standard/utils/common";

// CONSTANTS
const mockImage = 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=711&q=80'

// DEFAULT FUNCTIONS

type NFTTilePropType = {
    // You should declare props like this, delete this if you don't need props
    nft: NFT
}

const NFTTileDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
}

const NFTTile = (props: NFTTilePropType) => {
    const {nft} = props
    const {locale} = useContext(LocaleContext)
    const containerRef = React.createRef<HTMLDivElement>()
    const modalRef = React.createRef<HTMLDivElement>()
    const modalCloseRef = React.createRef<HTMLButtonElement>()


    const [modalOpen, setModalOpen] = useState(false)

    const getElementPointerPositionOffset = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = containerRef.current as HTMLDivElement
        let xOffsetPercent = (event.clientX - (element.offsetLeft + element.clientWidth/2)) / (element.clientWidth/2);
        let yOffsetPercent = (event.clientY - (element.offsetTop + element.clientHeight/2)) / (element.clientHeight/2);

        let rotateX = xOffsetPercent * 10;
        let rotateY = yOffsetPercent * 10;

        console.log(rotateX, rotateY)


        return {x: rotateX, y: rotateY}
    }

    const mouseEnterAnimation = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = containerRef.current as HTMLDivElement
        if(!element || modalOpen){
            return
        }

        const rotations = getElementPointerPositionOffset(event)

        element.style.transition = 'all 0.2s'
        element.style.boxShadow = `${rotations.x/2}px ${rotations.y/2}px 10px rgba(255, 255, 255, 0.2)`
        element.style.transform = `translateX(${rotations.x/4}px) translateY(${rotations.y/4}px)`
        setTimeout(()=> {
            element.style.transition = 'all 0.0s'
        }, 200)
    }
    const mouseOverAnimation = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = containerRef.current as HTMLDivElement
        if(!element || modalOpen){
            return
        }

        const rotations = getElementPointerPositionOffset(event)

        element.style.boxShadow = `${rotations.x/2}px ${rotations.y/2}px 10px rgba(255, 255, 255, 0.2)`
        element.style.transform = `translateX(${rotations.x/4}px) translateY(${rotations.y/4}px)`

    }

    const mouseOverAnimationEnd = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = containerRef.current as HTMLDivElement
        if(!element || modalOpen){
            return
        }

        element.style.transition = 'all 0.2s'
        element.style.boxShadow = '0 0 0px rgba(255, 255, 255, 0.2)'
        element.style.transform = `translateX(0) translateY(0)`
    }

    function openMoadal() {
        setModalOpen(true)
        const element = containerRef.current as HTMLDivElement
        if(!element){
            return
        }

        // element.style.position = `fixed`
        // modalClose.style.position = `fixed`


        // element.style.transition = 'all 0.5s'
        // element.style.transform = `translateX(${(window.innerWidth/2 - element.offsetLeft) - element.clientWidth/2}px) translateY(${((window.innerHeight/2 + window.scrollY) - element.offsetTop) - element.clientHeight/2}px)`
        // element.style.zIndex = '10'
    }

    function closeModal() {
        setModalOpen(false)
        const element = containerRef.current as HTMLDivElement
        if(!element){
            return
        }

        // element.style.position = `fixed`
        // modalClose.style.position = `fixed`


        // element.style.transform = `translateX(0) translateY(0)`
        // element.style.zIndex = '1'

        // setTimeout(()=>{
        //     element.style.transition = 'all 0s'
        // }, 500)
    }

    useEffect(()=>{
        closeModal()
    }, [containerRef.current])


    return (
        <>
            <div
                className={'NFTTile'}
                style={{position: 'relative'}}
                ref={containerRef}
                onMouseEnter={mouseEnterAnimation}
                onMouseMove={mouseOverAnimation}
                onMouseOut={mouseOverAnimationEnd}
            >
                <div className={'bg-blur'} style={{background: `url(${mockImage})`}}/>
                <img className={'nft-artwork'} src={mockImage}/>
                <div className={'nft-data'}>
                    {`${wei2eth(nft.price)} BUSD`}
                </div>
                <button onClick={openMoadal} className={'nft-card-button'}/>

                <div className={`by-nft-dialog ${modalOpen ? 'active': ''}`}>
                    <input placeholder="email" type="email"/>
                    <input placeholder="Your allocation in BUSD" type="number"/>
                </div>
            </div>
        </>
    )
};

NFTTile.defaultProps = NFTTileDefaultProps

export default NFTTile