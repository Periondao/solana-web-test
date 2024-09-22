/* eslint-disable @next/next/no-img-element */
'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'
import { Idl, Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'

import GifForm from './GifForm'

import baseAccJson from '@/lib/assets/baseAccount.json'
import idl from '@/lib/assets/gifIdl.json'

import './Gif.css'

const GifList = () => {
  const [gifs, setGifs] = useState<any[]>([])
  const connCtx = useConnection()

  const fetchGifs = useCallback(async () => {
    const program = new Program(idl as Idl, connCtx)
    const baseAccount = Keypair.fromSecretKey(Uint8Array.from(baseAccJson))

    const account = await (program.account as any).baseAccount.fetch(baseAccount.publicKey)
    console.log('yo gifList', account.gifList)
    setGifs(account.gifList)
  }, [connCtx])

  useEffect(() => {
    fetchGifs()
  }, [fetchGifs])

  return (
    <div className="connected-container">      
      <GifForm />
      <button onClick={fetchGifs} className="cta-button create-gif-button">
        Fetch gifs
      </button>
      <div className="gif-grid">
        {gifs.map((gifItem, index) => (
          <div key={index} className="gif-item" style={{ scale: 0.5 }}>
            <img src={gifItem.gifUrl} alt="gif" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GifList
