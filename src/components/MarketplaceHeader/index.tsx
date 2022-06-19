import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import styled from 'styled-components'
import {useParams} from "react-router-dom";
import BackArrowImg from '../../images/arrow.svg'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row wrap;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`

const Title = styled.div`
  font-weight: 700;
  font-size: 40px;
  letter-spacing: 5px;
`

const Subtitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 2px;
`

const BackArrow = styled.img`
  flex-grow: 1;
`

type MarketplaceHeaderPropType = {
  title: string
  subtitle: string
}

const MarketplaceHeaderDefaultProps = {
  title: 'NFT Marketplace',
  subtitle: 'Projects'
}

const MarketplaceHeader = (props: MarketplaceHeaderPropType) => {
  const {locale} = useContext(LocaleContext)
  const {title, subtitle} = props
  const [isBackArrowRendered, setIsBackArrowRendered] = useState<boolean>(false)

  const params: {projectId: string} = useParams()

  const checkBackArrowRendered = () => {
    if (params.projectId) {
      setIsBackArrowRendered(true)
    }
  }

  useEffect(() => {
    checkBackArrowRendered()
  }, [])

  return (
    <Container>
      {isBackArrowRendered && <BackArrow src={BackArrowImg} alt=""/>}
      <TextWrapper>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextWrapper>
      <div style={{width: 183, height: 50, background: 'white', flexGrow: 1}}>Collection</div>
    </Container>
  )
};

MarketplaceHeader.defaultProps = MarketplaceHeaderDefaultProps

export default MarketplaceHeader