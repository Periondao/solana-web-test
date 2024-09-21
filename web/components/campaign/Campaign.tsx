'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Program, Idl, utils, BN } from "@coral-xyz/anchor"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import idl from '@/lib/assets/idl.json'

const Campaign = () => {
  const connContext = useConnection()
  const wallet = useWallet()

  const createCampaign = async () => {
    if (!wallet?.publicKey) return alert('Connect wallet')

    try {
      const program = new Program(idl as Idl, connContext)
  
      const [campaign] = PublicKey.findProgramAddressSync([
          utils.bytes.utf8.encode("CampaignDemo"),
          wallet.publicKey.toBuffer(),
        ],
        program.programId
      )
  
      const tx = await program.methods.create('Berestrok', 'Vaique', new BN(2000))
        .accounts({
          systemProgram: SystemProgram.programId,
          user: wallet.publicKey,
          campaign,
        })
        .transaction()
  
      const resp = await wallet.sendTransaction(tx, connContext.connection)
  
      console.log('responso', resp)
  
      console.log('Campaign created:', campaign.toString())
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div>Min walleto</div>
      <button onClick={createCampaign}>Create Campaign</button>
    </div>
  )
}

export default Campaign
