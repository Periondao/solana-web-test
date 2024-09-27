import CreatePool from "@/components/fanplay/create-pool"
import PoolList from "@/components/fanplay/pool-list"

export default async function Index() {
  return (
    <div>
      <div>Test app for Fanplay Solana program</div>
      <CreatePool />
      <PoolList />
    </div>
  )
}
