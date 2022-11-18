// Make requests to CryptoCompare API
export async function makeApiRequest(path) {
	try {
		const response = await fetch(`https://tigristrade.info/chart-history-price-bot/${path}`);
		return response.json();
		//return {"prices":[{"id":1585,"pairId":0,"time":1649697180,"open":40825.15,"close":40804.5,"high":40825.15,"low":40804.5},{"id":1586,"pairId":0,"time":1649697240,"open":40804.39,"close":40791.81,"high":40804.39,"low":40783.59},{"id":1587,"pairId":0,"time":1649697300,"open":40791.8,"close":40746.04,"high":40791.8,"low":40746.04},{"id":1588,"pairId":0,"time":1649697360,"open":40746.02,"close":40653.64,"high":40746.02,"low":40598.89},{"id":1589,"pairId":0,"time":1649697420,"open":40589.41,"close":40556.59,"high":40589.41,"low":40556.59},{"id":1590,"pairId":0,"time":1649697480,"open":40556.58,"close":40429.13,"high":40556.58,"low":40406.94},{"id":1591,"pairId":0,"time":1649697540,"open":40429.11,"close":40444.41,"high":40448.23,"low":40406.49},{"id":1592,"pairId":0,"time":1649697600,"open":40411.79,"close":40416.67,"high":40444.3,"low":40410.89},{"id":1593,"pairId":0,"time":1649697660,"open":40416.57,"close":40398.82,"high":40416.57,"low":40392.97},{"id":1594,"pairId":0,"time":1649697720,"open":40399.03,"close":40388.84,"high":40415.39,"low":40379.45},{"id":1595,"pairId":0,"time":1649697780,"open":40388.89,"close":40431.86,"high":40436.51,"low":40385.06},{"id":1596,"pairId":0,"time":1649797180,"open":40431.85,"close":40417.86,"high":40432.31,"low":40417.86}]};
	} catch (error) {
		throw new Error(`CryptoCompare request error: ${error.status}`);
	}
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
	const short = `${fromSymbol}/${toSymbol}`;
	return {
		short,
		full: `${exchange}:${short}`,
	};
}

export function parseFullSymbol(fullSymbol) {
	const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
	if (!match) {
		return null;
	}

	return {
		exchange: match[1],
		fromSymbol: match[2],
		toSymbol: match[3],
	};
}