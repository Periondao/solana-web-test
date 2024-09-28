'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Idl, utils } from "@coral-xyz/anchor"
import { useState } from "react"

import idl from '@/lib/assets/fanplayIdl.json'

const CreatePool = () => {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const [poolId, setPoolId] = useState('')

  const createPool = async () => {
    if (!publicKey) return alert('Connect wallet')

    try {
      const program = new Program(idl as Idl, { connection })
      const gameId = 5

      // Convert game_id (u32) to little-endian 4-byte array
      const gameIdBytes = new Uint8Array(new Uint32Array([gameId]).buffer);

      const [poolAcc] = PublicKey.findProgramAddressSync([
          utils.bytes.utf8.encode(poolId),
          gameIdBytes,
          publicKey.toBuffer(),
        ],
        program.programId
      )

      console.log('poolAcc', poolAcc.toString(), poolId)

      const tx = await program.methods.createPool(poolId, gameId)
        .accounts({
          systemProgram: SystemProgram.programId,
          poolAccount: poolAcc, // ount.publicKey,
          user: publicKey,
        })
        // .signers([poolAccount])
        .transaction()

      console.log('tx', tx)

      // await simulateTxn(tx, publicKey, connection)

      const resp = await sendTransaction(tx, connection)

      console.log('txn response', resp)

      console.log('Pool created:', poolAcc.toString())
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <div>
      <h1>Create Pool</h1>
      <input
        type="text"
        placeholder="Pool ID"
        onChange={(e) => setPoolId(e.target.value)}
      />
      <button onClick={createPool}>Create Pool</button>
    </div>
  )
}

export default CreatePool
