import {BigNumber} from "bignumber.js";

export type NFT = {
    "name": string
    "price": BigNumber,
    "allocation": BigNumber,
    "limit": number,
    "totalBought": number,
    "active": boolean,
}

export type ProjectsDict = {[key: string]: NFT[]}
