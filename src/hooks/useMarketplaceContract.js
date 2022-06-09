import Marketplace from '../contract/AllocationMarketplace.json'
import {useContract} from "../Standard/hooks/useCommonContracts";
import {getAllocationMarketplaceContract} from '../utils/getAddress'

export const useMarketplaceContract = () => {
  const abi = Marketplace.abi;
  return useContract(abi, getAllocationMarketplaceContract())
}