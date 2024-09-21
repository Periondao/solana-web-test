import CampaignList from "@/components/campaign-list"
import Campaign from "@/components/campaign"

export default async function Index() {
  return (
    <div>
      <div>Index</div>
      <Campaign />
      <CampaignList />
    </div>
  );
}
