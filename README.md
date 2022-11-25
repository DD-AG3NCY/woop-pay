# web3-pay

web3-pay is a web application to make web3 payment requests frictionless


### Libraries

- NextJs 
- Wagmi
- Rainbow Kit
- Tailwind CSS
- ipfs-http
- Next-qr-code
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

Live deployment is made via Github / Vercel integration, as a vercel.app, from master branch.

Open [web3-pay](https://web3-pay-alpha.vercel.app/)
