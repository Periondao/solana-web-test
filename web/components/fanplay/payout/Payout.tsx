'use client'

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { useConnection } from "@solana/wallet-adapter-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Program } from "@coral-xyz/anchor"

import PayButton from "./PayButton"
import PoolInfo from "./PoolInfo"

import { Fanplay } from "@/lib/types/fanplay"

import idl from '@/lib/assets/fanplayIdl.json'

const Payout = () => {
  const { connection } = useConnection()

  const params = useSearchParams()
  const poolPubKey = params.get('pubKey')

  const [payouts, setPayouts] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [pool, setPool] = useState<any>()
  const [rake, setRake] = useState('')

  useEffect(() => {
    if (!poolPubKey) return

    const program = new Program(idl as Fanplay, { connection })

    program.account.poolAccount.fetch(poolPubKey)
      .then((pool) => setPool(pool))

    connection.getBalance(new PublicKey(poolPubKey))
      .then(balance => setBalance(balance / LAMPORTS_PER_SOL))
  }, [poolPubKey, connection])

  const addPayout = () => {
    setPayouts([...payouts, { userKey: '', amount: 0 }])
  }

  const removePayout = (index: number) => {
    const newPayouts = [...payouts]
    newPayouts.splice(index, 1)
    setPayouts(newPayouts)
  }

  const refreshPool = async () => {
    if (!poolPubKey) return

    const program = new Program(idl as Fanplay, { connection })
    const pool = await program.account.poolAccount.fetch(poolPubKey)
    setPool(pool)

    const bal = await connection.getBalance(new PublicKey(poolPubKey))
    setBalance(bal / LAMPORTS_PER_SOL)
  }

  if (!pool) return <div>Loading...</div>

  return (
    <div style={{ padding: '18px' }}>
      <div>
        <button style={{ all: 'unset', cursor: 'pointer', marginLeft: 10 }} onClick={refreshPool}>
          Refresh pool
        </button>
        <h1>Payout</h1>
      </div>
      <PoolInfo
        addPayout={addPayout}
        setRake={setRake}
        balance={balance}
        rake={rake}
        pool={pool}
      />
      {payouts.map((payout, index) => (
        <div key={index}>
          <input
            type="text"
            value={payout.userKey}
            onChange={(e) => {
              const newPayouts = [...payouts]
              newPayouts[index].userKey = e.target.value
              setPayouts(newPayouts)
            }}
            placeholder="Enter user key"
          />
          <input
            type="number"
            value={payout.amount}
            onChange={(e) => {
              const newPayouts = [...payouts]
              newPayouts[index].amount = Number(e.target.value)
              setPayouts(newPayouts)
            }}
            placeholder="Enter amount"
          />
          <button
            style={{ all: 'unset', marginLeft: 10, cursor: 'pointer' }}
            onClick={() => removePayout(index)}
          >
            X
          </button>
        </div>
      ))}
      <PayButton payouts={payouts} rake={rake} poolPubKey={poolPubKey} />
    </div>
  )
}

export default Payout
