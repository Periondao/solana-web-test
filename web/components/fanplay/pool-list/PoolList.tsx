/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { BN, Program } from "@coral-xyz/anchor"
import { useState } from "react"

import Pool from "./Pool"

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

  const placePick = async (pool: any, pickSpec: string) => {
    try {
      if (!publicKey) return alert('Connect wallet')

			const program = new Program(idl as Fanplay, { connection })

			const tx = await program.methods.placePick(
        pickSpec,
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
        <Pool key={pool.poolId} pool={pool} placePick={placePick} />
      ))}
    </div>
  )
}

export default PoolList
