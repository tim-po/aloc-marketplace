import {BigNumber} from "bignumber.js";

export type NFT = {
  projectAddress: string,
  name: string
  projectId: string,
  id?: number
  projectTypeId: string

  tokens?: Token[]
}

export type Token = {
  allocationAmount: string
  allocationLimit: string
  allowMint: boolean
  maxAllocation: string
  pauseMint: boolean
  price: string
  balance?: string
  nftCreativeLink: string
  nftId: number
  projectId: number
  userAllocation?: number
}

export type ProjectsDict = { [key: string]: NFT }
