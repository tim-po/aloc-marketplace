import CurrentNft from "../contract/CurrentNft.json";
import {useWeb3} from "../Standard/hooks/useCommonContracts";

export const useNftContract = (address: string | undefined) => {
  const abi = CurrentNft.abi;
  const web3 = useWeb3();
  if (address){
    // @ts-ignore
    return new web3.eth.Contract(abi, address);
  } else {
    return undefined
  }
}