import { LAMPORTS_PER_SOL } from "@solana/web3.js"

import AddressSpan from "@/components/fanplay/address-span"

interface PoolInfoProps {
  setRake: (value: string) => void
  addPayout: () => void
  balance: number
  rake: string
  pool: any
}

const PoolInfo = ({
  addPayout,
  setRake,
  balance,
  rake,
  pool,
}: PoolInfoProps) => {
  return (
    <>
      <div>Pool ID: <strong>{pool.poolId}</strong></div>
      <div>Game ID: <strong>{pool.gameId}</strong></div>
      <div>
        Pool admin:
        <AddressSpan address={pool.adminKey.toString()} />
      </div>
      <div>Pool total (SOL): <strong>{pool.poolTotal / LAMPORTS_PER_SOL}</strong></div>
      <div>Pool balance: {balance} rent+picks</div>
      <div style={{ margin: '5px 0', fontWeight: 'bold' }}>PICKS</div>
      {pool.picks.map((pick: any, index: number) => (
        <div key={pick.pickSpec + index} style={{ fontSize: 12, marginBottom: 10 }}>
          <div>Spec: <strong>{pick.pickSpec}</strong></div>
          <div>Amount: <strong>{pick.amount / LAMPORTS_PER_SOL}</strong></div>
          <div>Wallet: <AddressSpan address={pick.userKey.toString()} /></div>
        </div>
      ))}
      <input
        value={rake}
        onChange={e => setRake(e.target.value)}
        placeholder="Enter rake in SOL"
      />
      <button
        style={{ margin: '12px 0', display: 'block' }}
        onClick={addPayout}
      >
        Add Payout Winner
      </button>
    </>
  )
}

export default PoolInfo
