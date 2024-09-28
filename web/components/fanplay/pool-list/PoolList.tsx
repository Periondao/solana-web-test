/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { BN, Program } from "@coral-xyz/anchor"
import { useState } from "react"

import { truncateAddress } from "@/lib/utils"
import { Fanplay } from "@/lib/types/fanplay"

import idl from '@/lib/assets/fanplayIdl.json'

const PoolList = () => {
  const [list, setList] = useState<any[]>([])

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const getPools = async () => {
		const program = new Program(idl as Fanplay, { connection })

    const progAccounts = await connection.getProgramAccounts(program.programId)

    const promises = progAccounts.map(
      async (pool) => ({
        ...(await program.account.poolAccount.fetch(pool.pubkey)),
        pubkey: pool.pubkey,
      })
    )

		await Promise.all(promises).then((pools) => {
      console.log('pools', pools)
      setList(pools)
    })
	}

  const placePick = async (pool: any) => {
    try {
      if (!publicKey) return alert('Connect wallet')

			const program = new Program(idl as Fanplay, { connection })

			const tx = await program.methods.placePick(
        'w:BluePegasus',
        new BN(0.01 * LAMPORTS_PER_SOL)
      )
				.accounts({
					systemProgram: SystemProgram.programId,
					poolAccount: pool.pubkey,
					user: publicKey,
				} as any)
        .transaction()
			
      const resp = await sendTransaction(tx, connection)

      console.log('Txn signature', resp)
			console.log("Placed pick on Pool Id:", publicKey.toString())

			await getPools()
		} catch (error) {
			console.error("Error donating:", error);
		}
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div>Pool List</div>
      <button onClick={getPools}>Get Pools</button>
      {list.map(pool => (
        <div key={pool.pubkey.toString()} style={{ marginTop: 20 }}>
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
          <button onClick={() => placePick(pool)}>
            Place Pick
          </button>
        </div>
      ))}
    </div>
  )
}

export default PoolList
