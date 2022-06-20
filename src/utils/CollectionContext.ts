import React from 'react';

const CollectionContext = React.createContext({
  bubbleCount: 0,
  setCollectionBubbleValue: (newVal: number)=>{},
  collectionOpen: false,
  setCollectionOpen: (value: boolean) => {}
});

export default CollectionContext;
