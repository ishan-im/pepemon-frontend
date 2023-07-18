import {useCallback, useEffect, useState} from 'react'
import usePepemon from './usePepemon'
import { getMerkleContract, getMerkleDegoContract, getMerklePpblzContract, getMerklePpdexContract, getMerkleDistributor, merkleIsClaimed } from '../pepemon/utils'
import {Contract} from '@ethersproject/contracts';

const useIsClaimedMerkle = (index: number, merkleType?: 'ppblz' | 'ppdex' | 'univ2' | 'dego' | 'distributor', tokenId = null) => {
    const [isClaimed, setIsClaimed] = useState(null);
    const { account } = usePepemon()
    const pepemon = usePepemon()
    let contract: Contract;
    switch (merkleType) {
        case 'ppblz':
            contract = getMerklePpblzContract(pepemon);
            break;
        case 'ppdex':
            contract = getMerklePpdexContract(pepemon);
            break;
        case 'dego':
            contract = getMerkleDegoContract(pepemon);
            break;
		case 'distributor':
            contract = getMerkleDistributor(pepemon);
            break;
        default:
            contract = getMerkleContract(pepemon);
    }
    const handleClaimedMerkle = useCallback(
        async () => {
            try {
                return merkleIsClaimed(
                    contract,
                    merkleType === 'dego' ? account : index,
                    merkleType === 'dego',
					tokenId && tokenId
                )
            } catch(err) {
                console.error(err);
            }
        },
        [account, index, contract, merkleType, tokenId]
    )

    useEffect(() => {
        if (index) {
            handleClaimedMerkle().then((claimed) => {
                setIsClaimed(claimed);
            })
        }
    }, [index, handleClaimedMerkle])

    return isClaimed;
}

export default useIsClaimedMerkle
