import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import styled, {css} from 'styled-components'
import {useHistory, useParams} from "react-router-dom";
import BackArrowImg from '../../images/arrow.svg'
import CollectionButton from "../CollectionButton";
import Collection from "../../pages/Collection";
import CollectionContext from "../../utils/CollectionContext";

interface BackArrowProps {
  isBackArrowRendered: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
  padding: 20px 40px;
  width: 100%;

  @media screen and (max-width: 800px){
    justify-content: center;
    margin-bottom: 40px;
  }
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.div`
  font-weight: 700;
  font-size: 40px;
  letter-spacing: 5px;
  
  @media screen and (max-width: 800px){
    font-size: 24px;
    margin-top: 0px;
  }
`

const Subtitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 2px;

  @media screen and (max-width: 800px){
    font-size: 16px;
  }
`

const SideWrapper = styled.div`
  width: 183px;
  @media screen and (max-width: 800px){
    display: none;
  }
`

const CollectionWrapper = styled.div<{isOpen?: boolean}>`
  transition: all 0.8s;
  position: fixed;
  bottom: 0px;
  z-index: 1000;
  //max-width: 1088px;
  width: 100%;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  //background: #ff1d5e;
  ${(props)=> (props.isOpen && css`
    height: calc(100% - 100px);
  `)};
  
  @media screen and (max-width: 800px){
    height: 50px;
    width: 100px;
    left: 0;
    ${(props)=> (props.isOpen && css`
      height: calc(100% - 100px);
      width: 100%;
    `)};
  }
`

const BackArrow = styled.img<BackArrowProps>`
  cursor: pointer;
  visibility: ${p => p.isBackArrowRendered ? 'visible' : 'hidden'};
  min-width: 51px;
`

type MarketplaceHeaderPropType = {
  title: string
  subtitle: string
  redirectTo: string
}

const MarketplaceHeaderDefaultProps = {
  title: 'NFT Marketplace',
  subtitle: 'Projects',
  redirectTo: '/'
}

const MarketplaceHeader = (props: MarketplaceHeaderPropType) => {
  const {locale} = useContext(LocaleContext)
  const {title, subtitle, redirectTo} = props
  const [isBackArrowRendered, setIsBackArrowRendered] = useState<boolean>(false)
  const history = useHistory()
  const {collectionOpen, setCollectionOpen} = useContext(CollectionContext)

  const params: { projectId?: string, id?: string } = useParams()

  const checkBackArrowRendered = () => {
    if (params.projectId || params.id) {
      setIsBackArrowRendered(true)
    }
  }

  useEffect(() => {
    checkBackArrowRendered()
  }, [])

  return (
    <>
      <Container>
        <SideWrapper>
          <BackArrow
            src={BackArrowImg}
            alt=""
            onClick={() => history.push(redirectTo)}
            isBackArrowRendered={isBackArrowRendered}
          />
        </SideWrapper>
        <TextWrapper>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </TextWrapper>
        <SideWrapper>
          <CollectionButton/>
        </SideWrapper>
      </Container>
      <CollectionWrapper isOpen={collectionOpen}>
        <Collection isOpen={collectionOpen}  />
      </CollectionWrapper>
    </>
  )
};

MarketplaceHeader.defaultProps = MarketplaceHeaderDefaultProps

export default MarketplaceHeader