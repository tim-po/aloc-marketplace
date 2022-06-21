import React, {useContext} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import styled from 'styled-components'

interface TextProps {
  fontSize: number
  fontWeight: number
  marginBottom?: number
  marginLeft?: number
}

type NotificationPropType = {
  body: string
}

const NotificationDefaultProps = {}

const NotificationContainer = styled.div.attrs<NotificationPropType>(props => ({
  className: props.className
}))`

  &.shown {
    right: 20px;
  }
  
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  width: 360px;
  height: 125px;
  border-radius: 20px;
  padding: 13px 24px;
  background: rgba(177, 177, 177, 0.3);
  backdrop-filter: blur(80px);
`

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 12px;
`

const Text = styled.div<TextProps>`
  font-weight: ${p => p.fontWeight};
  font-size: ${p => p.fontSize}px;
  margin-bottom: ${p => p.marginBottom}px;
  margin-left: ${p => p.marginLeft}px;
`

const Notification = (props: NotificationPropType) => {
  const {locale} = useContext(LocaleContext)
  const {body} = props

  return (
    <NotificationContainer>
      <FlexWrapper>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.40095 35C2.63062 35 2.14956 34.1656 2.53552 33.499L19.1344 4.82817C19.5196 4.16289 20.4801 4.16289 20.8653 4.82817L37.4642 33.499C37.8501 34.1656 37.3691 35 36.5987 35H3.40095ZM18.9165 24.5C18.9165 25.0523 19.3642 25.5 19.9165 25.5H20.4165C20.9688 25.5 21.4165 25.0523 21.4165 24.5V17.1667C21.4165 16.6144 20.9688 16.1667 20.4165 16.1667H19.9165C19.3642 16.1667 18.9165 16.6144 18.9165 17.1667V24.5ZM20.1665 30.125C20.5276 30.125 20.8262 30.007 21.0623 29.7708C21.2984 29.5347 21.4165 29.2361 21.4165 28.875C21.4165 28.5139 21.2984 28.2153 21.0623 27.9792C20.8262 27.7431 20.5276 27.625 20.1665 27.625C19.8054 27.625 19.5068 27.7431 19.2707 27.9792C19.0346 28.2153 18.9165 28.5139 18.9165 28.875C18.9165 29.2361 19.0346 29.5347 19.2707 29.7708C19.5068 30.007 19.8054 30.125 20.1665 30.125ZM5.99984 32.5H33.9998L19.9998 8.33334L5.99984 32.5Z"
            fill="white"/>
        </svg>
        <Text fontWeight={700} fontSize={20} marginLeft={17}>
          No connection to wallet
        </Text>
      </FlexWrapper>
      <Text fontWeight={400} fontSize={16}>
        {body}
      </Text>
    </NotificationContainer>
  )
};

Notification.defaultProps = NotificationDefaultProps

export default Notification