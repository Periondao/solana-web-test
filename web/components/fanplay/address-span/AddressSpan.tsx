import { copyTextValue, truncateAddress } from "@/lib/utils"

interface AddressProps {
  address: string
}

const AddressSpan = ({ address }: AddressProps) => {
  const onAddressClick = () => {
    copyTextValue(address)
    alert('Address copied to clipboard')
  }

  return (
    <button
      style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline' }}
      onClick={onAddressClick}
    >
      {truncateAddress(address)}
    </button>
  )
}

export default AddressSpan
