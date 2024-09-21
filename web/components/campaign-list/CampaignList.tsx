'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { BN, Idl, Program } from "@coral-xyz/anchor"
import { useState } from "react"

import idl from '@/lib/assets/idl.json'

const CampaignList = () => {
  const [list, setList] = useState<any>([])
  const connContext = useConnection()
  const wallet = useWallet()

  const getCampaigns = async () => {
		const program = new Program(idl as Idl, connContext)

    const progAccounts = await connContext.connection.getProgramAccounts(program.programId)

    const promises = progAccounts.map(
      async (campaign) => ({
        ...(await (program.account as any).campaign.fetch(campaign.pubkey)),
        pubkey: campaign.pubkey,
      })
    )

		await Promise.all(promises).then((campaigns) => setList(campaigns))
	}

  const donate = async (publicKey: any) => {
		try {
      if (!wallet?.publicKey) return alert('Connect wallet')

			const program = new Program(idl as Idl, connContext)

			const tx = await program.methods.donate(new BN(0.15 * LAMPORTS_PER_SOL))
				.accounts({
					systemProgram: SystemProgram.programId,
					user: wallet.publicKey,
					campaign: publicKey,
				})
        .transaction()
			
      const resp = await wallet.sendTransaction(tx, connContext.connection)

      console.log('responson', resp)
			console.log("Donated some money to:", publicKey.toString())

			getCampaigns()
		} catch (error) {
			console.error("Error donating:", error);
		}
	}

  const withdraw = async (publicKey: any) => {
		try {
      if (!wallet?.publicKey) return alert('Connect wallet')

      const program = new Program(idl as Idl, connContext)

			const tx = await program.methods.withdraw(new BN(0.1 * LAMPORTS_PER_SOL))
				.accounts({
					user: wallet.publicKey,
					campaign: publicKey,
				})
        .transaction()

      const resp = await wallet.sendTransaction(tx, connContext.connection)

      console.log('responsone', resp)
			console.log("Withdrew some money from:", publicKey.toString());
		} catch (error) {
			console.error("Error withdrawing:", error);
		}
	}

  return (
    <div style={{ marginTop: 20 }}>
      <div>CampaignList</div>
      <button onClick={getCampaigns}>Get Campaigns</button>
      {list.map((campaign: any) => (
        <div key={campaign.pubkey.toString()} style={{ marginTop: 10 }}>
          <div>{campaign.name}</div>
          <div>{campaign.description}</div>
          <div>Raised: {campaign.amountRaised.toNumber()}</div>
          <div>Goal: {campaign.goalAmount.toNumber()}</div>
          <button onClick={() => donate(campaign.pubkey)}>Donate</button>
          <button onClick={() => withdraw(campaign.pubkey)}>Withdraw</button>
        </div>
      ))}
    </div>
  )
}

export default CampaignList
