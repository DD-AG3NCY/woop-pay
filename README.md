# Woop Pay

Woop Pay is a web application that simplifies cryptocurrency payment requests. You can connect your wallet to create a payment request and share it. Woop Pay supports native tokens ETHER and MATIC, and popular ERC20 tokens such as DAI, USDC, TETHER, WETH, and WBTC. It also supports multiple networks within the Ethereum ecosystem: Mainnet, Goerli, Arbitrum, Optimism, and Polygon.

### Libraries

- NextJs
- Wagmi
- Rainbow Kit
- Tailwind CSS
- ipfs-http
- Next-share

### Setup

1. Make `.env.local`

```shell
touch .env.local
```

add environment variable

```text
NEXT_PUBLIC_INFURA_PROJECT_ID={project_id}
NEXT_PUBLIC_INFURA_SECRET={secret}
NEXT_PUBLIC_ALCHEMY_ETHEREUM_MAINNET_API_KEY={key-mainnet}
NEXT_PUBLIC_ALCHEMY_ETHEREUM_GOERLI_API_KEY={key-goerli}
NEXT_PUBLIC_ALCHEMY_POLYGON_MAINNET_API_KEY={key-polygon}
NEXT_PUBLIC_ALCHEMY_OPTIMISM_MAINNET_API_KEY={key-optimism}
NEXT_PUBLIC_ALCHEMY_ARBITRUM_MAINNET_API_KEY={key-arbitrum}
```

3. Install dependencies

```bash
npm install
```

4. Start developmment

```bash
npm run dev
```

5. 📱 Open http://localhost:3000 to see the app

## Integrating with Woop Pay

It is possible to integrate Woop Pay with your application by programatically generating an URL request. The URL will look like the follwing:

```bash
https://www.wooppay.xyz/create/params?from=0xd4218255175160583A7d7F4854Ab2Eef4F45B144&token=ETH&value=0.00005&network=homestead
```

The URL is made of several fields, that are all mandatory to create the request link:

```bash
URL slug (hardcoded) => https://www.wooppay.xyz/create/

Object id (hardcoded) => params?

Receiver (dynamic) => from={wallet address}

Token (dynamic) => &token={token type}

Amount (dynamic) => &value={amount requested}

Network (dynamic) => &network={network name}
```

List of token types supported: ETH, MATIC, WETH, WBTC, DAI, USDC, USDT

List of network names supported: goerli, homestead, optimism, arbitrum, matic

### Code example

This is an example of a React component that allows to generate Woop Pay links programatically

```bash
import { useState } from 'react'
import { useRouter } from 'next/router'

function PaymentLinkGenerator() {
  const [walletAddress, setWalletAddress] = useState('')
  const [tokenType, setTokenType] = useState('')
  const [amount, setAmount] = useState('')
  const [networkName, setNetworkName] = useState('')
  const [paymentLink, setPaymentLink] = useState('')
  const router = useRouter()
  const baseUrl = 'https://www.wooppay.xyz/create/'

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'walletAddress') {
      setWalletAddress(value)
    } else if (name === 'tokenType') {
      setTokenType(value)
    } else if (name === 'amount') {
      setAmount(value)
    } else if (name === 'networkName') {
      setNetworkName(value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const queryParams = {
      from: walletAddress,
      token: tokenType,
      value: amount,
      network: networkName
    }
    const paymentLink = `${baseUrl}params?${new URLSearchParams(queryParams)}`
    setPaymentLink(paymentLink)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='walletAddress'>Wallet Address:</label>
      <input
        type='text'
        name='walletAddress'
        value={walletAddress}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor='tokenType'>Token Type:</label>
      <input
        type='text'
        name='tokenType'
        value={tokenType}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor='amount'>Amount:</label>
      <input
        type='text'
        name='amount'
        value={amount}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor='networkName'>Network Name:</label>
      <input
        type='text'
        name='networkName'
        value={networkName}
        onChange={handleInputChange}
      />
      <br />
      <button type='submit'>Generate Payment Link</button>
      {paymentLink && (
        <a href={paymentLink}>Make Payment</a>
      )}
    </form>
  )
}
```

This feature is still in beta mode. Play carefully and always double-check the receiver of the transaction. In case of questions about the integration, please send a message to alessandro@wooppay.xyz

## Production

Live deployment is made via Github / Vercel integration from master branch.

Open [Woop Pay](https://wooppay.xyz)
