import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { BN, Program } from "@coral-xyz/anchor"

import { Fanplay } from "@/lib/types/fanplay"

import idl from '@/lib/assets/fanplayIdl.json'

interface PayProps {
  poolPubKey: string | null
  payouts: any[]
  rake: string
}

const PayButton = ({ payouts, poolPubKey, rake }: PayProps) => {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const payoutWinners = async () => {
    if (!poolPubKey) return alert('No pool selected')

    const program = new Program(idl as Fanplay, { connection })

    const remainingAccounts = payouts.map(({ userKey }) => ({
      pubkey: new PublicKey(userKey),
      isSigner: false,
      isWritable: true,
    }))

    const mappedPayouts = payouts.map(({ userKey, amount }) => ({
      amount: new BN(amount * LAMPORTS_PER_SOL),
      userKey: new PublicKey(userKey),
    }))

    console.log('mapped payouts', mappedPayouts)
    console.log('remaining accounts', remainingAccounts)

    if (isNaN(+rake)) return alert('Rake must be a number')
    const rakeBn = new BN(+rake * LAMPORTS_PER_SOL)
  
    try {
      const tx = await program.methods.payout(rakeBn, mappedPayouts)
        .accounts({
          systemProgram: SystemProgram.programId,
          poolAccount: new PublicKey(poolPubKey),
          user: publicKey,
        } as any)
        .remainingAccounts(remainingAccounts)
        .transaction()
    
      console.log('txn instruction', tx)

      const resp = await sendTransaction(tx, connection)

      console.log('txn response', resp)
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <button
      style={{ marginTop: 20, fontSize: 20, fontStyle: 'bold' }}
      onClick={payoutWinners}
    >
      SEND PAYOUT
    </button>
  )
}

export default PayButton
