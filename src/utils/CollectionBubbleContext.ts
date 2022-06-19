import React from 'react';

const CollectionBubbleContext = React.createContext({ bubbleCount: 0, setCollectionBubbleValue: (newVal: number)=>{} });

export default CollectionBubbleContext;
