import { NETWORK as POLYGON } from "./polygon-main/index";
import { NETWORK as ARBITRUM } from "./arbitrum/index";
import { NETWORK as ARBGOERLI } from "./arbi-test/index";

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

export const getNetwork = (networkId:any) => {
    switch(networkId) {
        case 137:
            return POLYGON;
        case 42161:
            return ARBITRUM;
        case 421613:
            return ARBGOERLI;
        default:
            return {
                network_id: 0,
                name: "Unsupported",
                rpc: "",
                icon: "assets/images/unsupported.png",
                layerzero: 0,
                addresses: {
                    positions: "",
                    trading: "",
                    tradinglibrary: "",
                    tigusd: "",
                    tigusdvault: "",
                    pairscontract: "",
                    referrals: "",
                    govnft: "0x"
                },
                abis: {
                    positions: [],
                    trading: [],
                    tradinglibrary: [],
                    erc20: [],
                    pairscontract: [],
                    referrals: [],
                },
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
                        name: "tigUSD",
                        address: "",
                        stablevault: "",
                        decimals: 18,
                        hasPermit: false,
                        image: "assets/images/tigUSD.svg"
                    },
                    {
                        name: "",
                        address: "",
                        stablevault: "",
                        decimals: 18,
                        hasPermit: false,
                        image: ""
                    },
                    {
                        name: "",
                        address: "",
                        stablevault: "",
                        decimals: 18,
                        hasPermit: false,
                        image: ""
                    }
                ],
                nativeSupported: false
            };
    }
}