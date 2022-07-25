import {BigNumber} from "bignumber.js";

export type NFT = {
  "projectAddress": string,
  projectName?: string
  "name": string
  "price": BigNumber,
  "allocation": BigNumber,
  "limit": number,
  "totalBought": number,
  "active": boolean,
  projectId: number,
  id?: number
}

export type Token = {
  allocationAmount: string
  allocationLimit: string
  allowMint: boolean
  maxAllocation: string
  pauseMint: boolean
  price: string
}

export type ProjectsDict = { [key: string]: NFT[] }
