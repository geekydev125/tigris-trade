/* eslint-disable */
import * as React from 'react';
import './src/index.css';
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	IChartingLibraryWidget,
	ResolutionString,
	TimeFrameType,
	VisiblePriceRange,
} from '../../../charting_library';
import Datafeed from './datafeed.js';
import { useEffect, useState } from 'react';
import { getNetwork } from '../../../constants/networks/index';


export interface ChartContainerProps {
	asset:any;
	pendingLine:any;
}

function getLanguageFromURL(): LanguageCode | null {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

export const TVChartContainer = ({asset, pendingLine}:ChartContainerProps) => {

	const widgetOptions: ChartingLibraryWidgetOptions = {
		symbol: getNetwork(0).assets[asset].name as string,
		// tslint:disable-next-line:no-any
		datafeed: Datafeed,
		interval: '1' as ResolutionString,
		container: 'tv_chart_container',
		library_path: '/charting_library/' as string,

		locale: getLanguageFromURL() || 'en',
		disabled_features: ['use_localstorage_for_settings','header_symbol_search','header_compare'],
		enabled_features: ['study_template'],
		charts_storage_api_version: '1.1',
		client_id: 'tradingview.com',
		user_id: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studies_overrides: {},
		theme: 'Dark',
		overrides: {
			"paneProperties.background": "#101418",
			 "paneProperties.backgroundType": "solid",
		},
		toolbar_bg: '#101418'
	};
	const [tvWidget, setTVWidget] = useState<IChartingLibraryWidget>();
	
	useEffect(() => {
		setTVWidget(new widget(widgetOptions));
	}, []);

	useEffect(() => {
		// try {
		// 	let visibleRange = tvWidget?.activeChart().getVisibleRange();
		// 	if (visibleRange != null) {
		// 		let newWidget: IChartingLibraryWidget = new widget(widgetOptions);
		// 		newWidget.onChartReady(() => {
		// 			if (visibleRange != null) {
		// 				newWidget.activeChart().setVisibleRange(visibleRange);
		// 				setTVWidget(newWidget);
		// 			}
		// 		});
		// 	}			
		// } catch {
			setTVWidget(new widget(widgetOptions));
		//}

	}, [asset]);

	useEffect(() => {
		if(pendingLine == 0) {
			tvWidget?.chart().removeAllShapes();
			return;
		}

		tvWidget?.chart().createShape({price: pendingLine, time: 0}, {shape: "horizontal_line", text: "Opening price"});
    }, [pendingLine]);

	return (
		<div
			className={ 'TVChartContainer' }
			id={'tv_chart_container'}
		/>
	);
	
}

