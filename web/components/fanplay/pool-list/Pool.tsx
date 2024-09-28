/* eslint-disable @typescript-eslint/no-explicit-any */

import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useState } from "react"

import { truncateAddress } from "@/lib/utils"

interface PoolProps {
  placePick: (pool: any, pickSpec: string) => void
  pool: any
}

const Pool = ({ pool, placePick }: PoolProps) => {
  const [spec, setSpec] = useState('')

  return (
    <div style={{ marginTop: 20 }}>
      <div>Pool ID: <strong>{pool.poolId}</strong></div>
      <div>Game ID: <strong>{pool.gameId}</strong></div>
      <div>Pool total (SOL): <strong>{pool.poolTotal / LAMPORTS_PER_SOL}</strong></div>
      <div style={{ margin: '5px 0', fontWeight: 'bold' }}>PICKS</div>
      {pool.picks.map((pick: any, index: number) => (
        <div key={pick.pickSpec + index} style={{ fontSize: 12, marginBottom: 10 }}>
          <div>Spec: <strong>{pick.pickSpec}</strong></div>
          <div>Amount: <strong>{pick.amount / LAMPORTS_PER_SOL}</strong></div>
          <div>Wallet: {truncateAddress(pick.userKey.toString())}</div>
        </div>
      ))}
      <input
        type="text"
        value={spec}
        onChange={(e) => setSpec(e.target.value)}
        placeholder="Enter pick spec"
      />
      <button onClick={() => placePick(pool, spec)}>
        Place Pick
      </button>
    </div>
  )
}

export default Pool
