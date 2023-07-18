import { useCallback } from 'react'
import usePepemon from './usePepemon'
import { harvest, getPpdexContract } from '../pepemon/utils'

const useReward = (pid: number) => {
  const { account } = usePepemon()
  const pepemon = usePepemon()
  const ppdexContract = getPpdexContract(pepemon)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(ppdexContract, pid, account)
    return txHash
  }, [account, pid, ppdexContract])

  return { onReward: handleReward }
}

export default useReward
