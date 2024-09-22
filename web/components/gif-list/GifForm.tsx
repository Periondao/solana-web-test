'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, SystemProgram } from '@solana/web3.js'
import { Idl, Program } from '@coral-xyz/anchor'

import baseAccJson from '@/lib/assets/baseAccount.json'
import idl from '@/lib/assets/gifIdl.json'

import './Gif.css'

const baseAccount = Keypair.fromSecretKey(Uint8Array.from(baseAccJson))

const GifForm = () => {
  const connContext = useConnection()
  const walletContext = useWallet()

  const onSubmit = async (event: any) => {
    event.preventDefault()
    const form = event.target
    const input = form.querySelector('input')
    const gifUrl = input.value

    if (!walletContext?.publicKey) return alert('Connect wallet')

    try {
      const program = new Program(idl as Idl, connContext)

      const tx = await program.methods.addGif(gifUrl)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: walletContext?.publicKey,
        })
        .transaction()

      console.log('submit tx', tx)

      const resp = await walletContext.sendTransaction(tx, connContext.connection)

      console.log('submit resp', resp)
    } catch (error) {
      console.error('Error submitting gif:', error)
    }
  }

  const createGifAccount = async () => {
    if (!walletContext?.publicKey) return alert('Connect wallet')

    const program = new Program(idl as Idl, connContext)

    try {
      const tx = await program.methods.initialize()
        .accounts({
          systemProgram: SystemProgram.programId,
          baseAccount: baseAccount.publicKey,
          user: walletContext.publicKey,
        })
        .signers([baseAccount])
        .transaction()

      console.log('tx', tx)

      const resp = await walletContext.sendTransaction(tx, connContext.connection, {
        signers: [baseAccount],
      })

      console.log('resp', resp)
    } catch (error) {
      console.error('Error creating gif account:', error)
    }
  }

  return (
    <div>
      <button onClick={createGifAccount} className="cta-button create-gif-button">
        Create Gif Account
      </button>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Enter gif link" />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
    </div>
  )
}

export default GifForm
