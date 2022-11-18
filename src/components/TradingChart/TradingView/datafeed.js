import {
	makeApiRequest,
	generateSymbol,
	parseFullSymbol,
} from './src/helpers.js';
import {
	subscribeOnStream,
	unsubscribeFromStream,
} from './src/streaming.js';
import {
	getNetwork
} from '../../../constants/networks/index.tsx';

const lastBarsCache = new Map();

const configurationData = {
	supported_resolutions: ['1', '15', '60', '240'],
	exchanges: [],
	symbols_types: [],
};

function isClosed(asset) {
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

async function getAllSymbols() {
	let TradingAssets = [];
	for (let i=0; i<getNetwork(0).assets.length; i++) {
		TradingAssets.push(
			{
				symbol: getNetwork(0).assets[i].name,
				full_name: getNetwork(0).assets[i].name,
				description: getNetwork(0).assets[i].name,
				exchange: "Tigris",
				type: 'crypto',
				id: i,
				pricescale: 10**(getNetwork(0).assets[i].decimals)
			}
		);
	}
	return TradingAssets;
}

export default {
	onReady: (callback) => {
		console.log('[onReady]: Method call');
		setTimeout(() => callback(configurationData));
	},

	searchSymbols: async (
		userInput,
		exchange,
		symbolType,
		onResultReadyCallback,
	) => {
		onResultReadyCallback([]);
	},

	resolveSymbol: async (
		symbolName,
		onSymbolResolvedCallback,
		onResolveErrorCallback,
	) => {
		console.log('[resolveSymbol]: Method call', symbolName);
		const symbols = await getAllSymbols();
		const symbolItem = symbols.find(({
			full_name,
		}) => full_name === symbolName);
		if (!symbolItem) {
			console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
			onResolveErrorCallback('cannot resolve symbol');
			return;
		}
		const symbolInfo = {
            id: symbolItem.id,
			ticker: symbolItem.full_name,
			name: symbolItem.symbol,
			description: symbolItem.description,
			type: symbolItem.type,
			session: '24x7',
			timezone: 'Etc/UTC',
			exchange: symbolItem.exchange,
			minmov: 1,
			pricescale: symbolItem.pricescale,
			has_intraday: false,
			has_no_volume: true,
			has_weekly_and_monthly: false,
			supported_resolutions: configurationData.supported_resolutions,
			volume_precision: 2,
			data_status: 'streaming',
            has_intraday: true,
		};

		console.log('[resolveSymbol]: Symbol resolved', symbolName);
		onSymbolResolvedCallback(symbolInfo);
	},

	getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
		const { from, to, firstDataRequest } = periodParams;
		console.log('[getBars]: Method call', symbolInfo, resolution, from, to);

		try {
			const data = await makeApiRequest(`c/${symbolInfo.id}/1/${from}/${to}`);
            console.log(data);
			if (data.Response && data.Response === 'Error' || data.prices.length === 0) {
				// "noData" should be set if there is no data in the requested period.
				onHistoryCallback([], {
					noData: true,
				});
				return;
			}
			let bars = [];
			data.prices.forEach(bar => {
                //console.log("hi");
                //console.log(bar.time);
				//if (bar.time >= from && bar.time < to) {
					bars = [...bars, {
						time: bar.time * 1000,
						low: bar.low,
						high: bar.high,
						open: bar.open,
						close: bar.close,
					}];
				//}
			});
			if (firstDataRequest) {
				lastBarsCache.set(symbolInfo.full_name, {
					...bars[bars.length - 1],
				});
			}
			console.log(`[getBars]: returned ${bars.length} bar(s)`);
			onHistoryCallback(bars, {
				noData: false,
			});
		} catch (error) {
			console.log('[getBars]: Get error', error);
			onErrorCallback(error);
		}
	},

	subscribeBars: (
		symbolInfo,
		resolution,
		onRealtimeCallback,
		subscribeUID,
		onResetCacheNeededCallback,
	) => {
		console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);

		if(!isClosed(symbolInfo.id))
			subscribeOnStream(
				symbolInfo,
				resolution,
				onRealtimeCallback,
				subscribeUID,
				onResetCacheNeededCallback,
				lastBarsCache.get(symbolInfo.full_name),
				symbolInfo.id
			);
	},

	unsubscribeBars: (subscriberUID) => {
		console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
		// unsubscribeFromStream(subscriberUID);
	},
};