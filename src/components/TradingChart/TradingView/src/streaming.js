import socketio from "socket.io-client";

const socket = socketio.connect('https://seashell-app-dxaza.ondigitalocean.app/', {transports: ['websocket'] });
const channelToSubscription = new Map();

socket.on('connect', () => {
	console.log('[socket] Connected');
});

socket.on('disconnect', (reason) => {
	console.log('[socket] Disconnected:', reason);
});

socket.on('error', (error) => {
	console.log('[socket] Error:', error);
});

var lastDailyBar;
var callback;
var cAsset = 0;

socket.on('Prices', data => {

	const tradePrice = parseFloat(data.prices[cAsset]);
	var tNow = new Date().getTime();
	const tradeTime = tNow - tNow % 60000;

	if (lastDailyBar === undefined || callback === undefined) {
		return;
	}
	const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);

	let bar;
	if (tradeTime > nextDailyBarTime) {
		bar = {
			time: tradeTime,
			open: lastDailyBar.close,
			high: Math.max(tradePrice, lastDailyBar.close),
			low: Math.min(tradePrice, lastDailyBar.close),
			close: tradePrice,
		};

	} else {
		bar = {
			...lastDailyBar,
			high: Math.max(lastDailyBar.high, tradePrice),
			low: Math.min(lastDailyBar.low, tradePrice),
			close: tradePrice,
		};

	}
	lastDailyBar = bar;

	callback(bar);
});

function getNextDailyBarTime(barTime) {
	const date = new Date(barTime * 1000);
	date.setDate(date.getDate());
	return date.getTime() / 1000;

}

export function subscribeOnStream(
	symbolInfo,
	resolution,
	_onRealtimeCallback,
	subscribeUID,
	onResetCacheNeededCallback,
	_lastDailyBar,
	_asset
) {
	lastDailyBar = _lastDailyBar;
	cAsset = _asset;
	callback = _onRealtimeCallback;

}

export function unsubscribeFromStream(subscriberUID) {

}