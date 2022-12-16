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

### Production

Live deployment is made via Github / Vercel integration from master branch.

Open [Woop Pay](https://wooppay.xyz)
