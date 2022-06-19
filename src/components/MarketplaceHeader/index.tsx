import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import styled from 'styled-components'
import {useHistory, useParams} from "react-router-dom";
import BackArrowImg from '../../images/arrow.svg'

interface BackArrowProps {
  isBackArrowRendered: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
  padding: 20px 40px;
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
`

const Subtitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 2px;
`

const BackArrow = styled.img<BackArrowProps>`
  cursor: pointer;
  visibility: ${p => p.isBackArrowRendered ? 'visible' : 'hidden'};
  min-width: 51px;
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
  const history = useHistory()

  const params: { projectId: string } = useParams()

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
      <div style={{width: 183}}>
        <BackArrow
          src={BackArrowImg}
          alt=""
          onClick={() => history.push('/projects')}
          isBackArrowRendered={isBackArrowRendered}
        />
      </div>
      <TextWrapper>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextWrapper>
      <div style={{width: 183, height: 50, background: 'white'}}>Collection</div>
    </Container>
  )
};

MarketplaceHeader.defaultProps = MarketplaceHeaderDefaultProps

export default MarketplaceHeader