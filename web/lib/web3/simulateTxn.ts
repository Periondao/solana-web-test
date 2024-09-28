import { 
  PublicKey, TransactionMessage, VersionedTransaction, Transaction, Connection,
} from "@solana/web3.js"

export const simulateTxn = async (
  tx: Transaction,
  publicKey: PublicKey,
  connection: Connection,
) => {
  const latestBlock = await connection.getLatestBlockhash()
  tx.recentBlockhash = latestBlock.blockhash
  // tx.feePayer = wallet.publicKey

  const message = new TransactionMessage({
    recentBlockhash: tx.recentBlockhash,
    instructions: tx.instructions,
    payerKey: publicKey,
  }).compileToV0Message()

  const estimatedGas = await connection.getFeeForMessage(message)
  console.log('estimatedGas', estimatedGas)

  const versionedTx = new VersionedTransaction(message)
  console.log('versionedTx', versionedTx)

  const simulationResult = await connection.simulateTransaction(versionedTx)
  console.log('simulationResult', simulationResult)
}
