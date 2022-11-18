/* eslint-disable */
import React, { useContext, useCallback, useState, useEffect} from 'react';
import {createChart, CrosshairMode} from 'lightweight-charts';
import { SocketContext} from '../../context/socket';
import { Center } from '@chakra-ui/react';
import { TVChartContainer } from './TradingView/index';

type Props = {
	asset: any;
    prices: any;
    pendingLine: any;
}

const TradingChart = ({asset, prices, pendingLine} : Props) => {
    return (
        <div>
            <div className="price_wave_area" style={{padding: '0px 0px'}}>
                <TVChartContainer asset={asset} pendingLine={pendingLine}/>
            </div>
        </div>  
    );
}

export default TradingChart;