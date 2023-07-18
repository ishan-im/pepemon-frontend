import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getStaked, getPpdexContract } from '../pepemon/utils'
import usePepemon from './usePepemon'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = usePepemon()
  const pepemon = usePepemon()
  const ppdexContract = getPpdexContract(pepemon)

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(ppdexContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, ppdexContract])

  useEffect(() => {
    if (account && pepemon) {
      fetchBalance()
    }
  }, [account, pepemon, fetchBalance])

  return balance
}

export default useStakedBalance
