import React, {useContext, useEffect, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'
import CollectionIcon from '../../icons/collection'
import CollectionContext from "../../utils/CollectionContext";

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

type CollectionButtonPropType = {
    // You should declare props like this, delete this if you don't need props
}

const CollectionButtonDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
}

const CollectionButton = (props: CollectionButtonPropType) => {
  const {locale} = useContext(LocaleContext)
  const bubbleContext = useContext(CollectionContext)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isFirstChange, setIsFirstChange] = useState(true)
  const {setCollectionOpen} = useContext(CollectionContext)

  const [bubbleCount, setBubbleCount] = useState<string>('')


  useEffect(()=>{
    if(!isFirstChange) {
      setShouldAnimate(true)
      setTimeout(() => {
        setShouldAnimate(false)
        if(bubbleContext.bubbleCount != 0) {
          setBubbleCount(`${bubbleContext.bubbleCount}`)
        }
      }, 800)
    }else {
      setIsFirstChange(false)
      if(bubbleContext.bubbleCount != 0) {
        setBubbleCount(`${bubbleContext.bubbleCount}`)
      }
    }
  }, [bubbleContext.bubbleCount])

  return (
        <div className={`CollectionButton ${shouldAnimate ? 'animate': ''}`}>
          <div className={`bubble ${bubbleCount ? 'shown': ''}`}>{bubbleCount}</div>
          <div className={'CollectionButton-inner'} onClick={() => setCollectionOpen(true)}>
            <div className={'inner-gradient'}/>
            <CollectionIcon />
            Collection
          </div>
        </div>
    )
};

CollectionButton.defaultProps = CollectionButtonDefaultProps

export default CollectionButton