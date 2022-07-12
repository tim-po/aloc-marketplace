import React, {useContext} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import styled from 'styled-components';
import BubbleLayout from "../../Standard/components/BubbleLayout";
import {switchNetwork} from "../../Standard/wallet";

type BadNetworkErrorPropType = {}

const BadNetworkErrorDefaultProps = {}

const BadNetworkPageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;
`

const Text = styled.div`
  font-weight: 700;
  font-size: 40px;
  margin-bottom: 60px;
`

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 20px;
  width: 500px;
  text-align: center;
  margin-bottom: 60px;
`

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 10;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #FFFFFF;
  width: 240px;
  height: 50px;
  background: #33CC66;
  border-radius: 10px;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  
  &:focus,
  &:active {
    outline: none;
  }
`

const BadNetworkError = (props: BadNetworkErrorPropType) => {
  const {locale} = useContext(LocaleContext)

  return (
    <BadNetworkPageContainer>
      <BubbleLayout/>
      <FlexWrapper>
        <Text>Wrong network</Text>
        <SubTitle>
          In order to continue working with MMPro Marketplace,
          please change your network
        </SubTitle>
        <Button onClick={switchNetwork}>Change network</Button>
      </FlexWrapper>
    </BadNetworkPageContainer>
  )
};

BadNetworkError.defaultProps = BadNetworkErrorDefaultProps

export default BadNetworkError

