import { POSITIONS_ABI, TRADING_ABI, ERC20_ABI, PAIR_ABI, VAULT_ABI, NFT_SALE, GOV_NFT, TRADINGLIBRARY_ABI, STAKING_ABI, REF_ABI } from "../../abis"

function isClosed(asset:any) {
    if(asset == 2 || asset == 32 || asset == 5 || asset == 6 || asset == 7 || asset == 8 || asset == 10) {
		const d = new Date();
		let day = d.getUTCDay();
		let hour = d.getUTCHours();
		let minute = d.getUTCMinutes();
	
		if(day == 0 && hour < 21) {
			return true;
		} else if (day == 6) {
			return true;
		} else if (day == 5 && hour > 20) {
			return true;
		}
	} else return false;
}

export const NETWORK = {
    network_id: 421613,
    name: "Arbitrum Görli",
    rpc: "https://goerli-rollup.arbitrum.io/rpc/",
    layerzero: 0,
    addresses: {
        positions: "0x4c039eb0BcCce06AD4b55a6FFDb9bD8268792b63",
        trading: "0x08Ef2551B410Bd1Abee738555F3037c5f4BF990d",
        tradinglibrary: "0xd465a4F04989eC28131252a7405f0ce8Da9768b4",
        tigusd: "0x9F27e49160F1c2562020cB6e422331B31b2b9e2B",
        tigusdvault: "0xFb54f7B869690779067E9edf90320A4E30Df7Ef5",
        pairscontract: "0x11BfacFB60de9c44073426DdA44f9f21863C4834",
        treasury: "0x1727FC1d930912FA075ff82741d9f50362350589",
        govnft: "0xb7346782aeB001bD9070F98EA30C2E590BCDD007",
        referrals: "0xd1bF71b53E32C089A26C3bFD880d9DdF08425636",
        nftsale: "0xd1bF71b53E32C089A26C3bFD880d9DdF08425636"
    },
    abis: {
        positions: POSITIONS_ABI,
        trading: TRADING_ABI,
        tradinglibrary: TRADINGLIBRARY_ABI,
        erc20: ERC20_ABI,
        pairscontract: PAIR_ABI,
        tigusdvault: VAULT_ABI,
        nftsale: NFT_SALE,
        govnft: GOV_NFT,
        staking: STAKING_ABI,
        referraks: REF_ABI,
    },
    icon: "assets/images/arbtest.png",
    gasLimit: 2_000_000,
    assets: [
        {
            name: "BTC/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(0),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 2,
        },
        {
            name: "ETH/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(1),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 2,
        },
        {
            name: "XAU/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(2),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 2,
        },
        {
            name: "MATIC/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(3),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4,
        },
        {
            name: "LINK/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(4),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3,
        },
        {
            name: "EUR/USD",
            minPosition: 500,
            minLev: 4,
            maxLev: 500,
            fee: 0.0004,
            isClosed: isClosed(5),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5,
        },
        {
            name: "GBP/USD",
            minPosition: 500,
            minLev: 4,
            maxLev: 500,
            fee: 0.0004,
            isClosed: isClosed(6),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5,
        },
        {
            name: "JPY/USD",
            minPosition: 500,
            minLev: 4,
            maxLev: 500,
            fee: 0.0004,
            isClosed: isClosed(7),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 6,
        },
        {
            name: "RUB/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 10,
            fee: 0.01,
            isClosed: isClosed(8),
            defaultLev: 10,
            defaultMargin: 50,
            decimals: 5,
        },
        {
            name: "CHF/USD",
            minPosition: 500,
            minLev: 4,
            maxLev: 500,
            fee: 0.0004,
            isClosed: isClosed(9),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5,
        },
        {
            name: "CAD/USD",
            minPosition: 500,
            minLev: 4,
            maxLev: 500,
            fee: 0.0004,
            isClosed: isClosed(10),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5,
        },
        {
            name: "ETH/BTC",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(11),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 6,
        },
        {
            name: "XRP/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(12),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5,
        },
        {
            name: "BNB/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(13),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3,
        },
        {
            name: "ADA/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(14),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5,
        },
        {
            name: "ATOM/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(15),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4,
        },
        {
            name: "HBAR/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(16),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 6,
        },
        {
            name: "TRX/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(17),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 6,
        },
        {
            name: "SOL/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(18),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4,
        },
        {
            name: "DOGE/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(19),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 7,
        },
        {
            name: "LTC/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(20),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4,
        },
        {
            name: "BCH/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(21),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3
        },
        {
            name: "ETC/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(22),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3
        },
        {
            name: "DOT/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(23),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3
        },
        {
            name: "XMR/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(24),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3
        },
        {
            name: "SHIB/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(25),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 9
        },
        {
            name: "AVAX/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(26),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4
        },
        {
            name: "UNI/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(27),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4
        },
        {
            name: "XLM/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(28),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 7
        },
        {
            name: "NEAR/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(29),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4
        },
        {
            name: "ALGO/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(30),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 5
        },
        {
            name: "ICP/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(31),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 3
        },
        {
            name: "XAG/USD",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(32),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 4
        },
        {
            name: "LINK/BTC",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(33),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 7
        },
        {
            name: "XMR/BTC",
            minPosition: 500,
            minLev: 2,
            maxLev: 100,
            fee: 0.002,
            isClosed: isClosed(34),
            defaultLev: 100,
            defaultMargin: 5,
            decimals: 6
        },
    ],
    marginAssets: [
        {
            name: "DAI",
            address: "0xE94Aa6479601544a32e43CAF082A2F7FC7fB0720",
            stablevault: "0xFb54f7B869690779067E9edf90320A4E30Df7Ef5",
            decimals: 18,
            hasPermit: true,
            image: "assets/images/dai.png"
        },
        {
            name: "USDT",
            address: "0xfb59C8Cac513440cD93306987BcfC53202940868",
            stablevault: "0xFb54f7B869690779067E9edf90320A4E30Df7Ef5",
            decimals: 6,
            hasPermit: true,
            image: "assets/images/usdt.png"
        }
    ],
    nativeSupported: false
}