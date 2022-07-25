import AllocationMarketplace from '../contract/AllocationMarketplace.json'
import {useContract} from "../Standard/hooks/useCommonContracts";
import {getAllocationMarketplaceContract} from '../utils/getAddress'

export const useAllocationMarketplaceContract = () => {
  const abi = AllocationMarketplace.abi;
  return useContract(abi, getAllocationMarketplaceContract())
}
