export const truncateAddress = (
  addressString = '',
  initialDigits = 4,
  finalDigits = -4
) =>
  `${addressString.slice(0, initialDigits)}...${addressString.slice(
    finalDigits
  )}`

export const copyTextValue = (value: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = value

  document.body.appendChild(textArea)
  textArea.select()

  document.execCommand('copy')
  textArea.remove()
}
