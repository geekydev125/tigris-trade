import React, { useContext, useCallback, useState } from 'react';
import {SocketContext} from '../../context/socket';
import Asset from './components/Asset'

type Props = {
    handleAssetChange: any;
    cPrice: any;
    oPrice: any;
    currentNetwork: any;
}

export default function AssetSelect({ handleAssetChange, cPrice, oPrice, currentNetwork }: Props) {

    const socket = useContext(SocketContext);
    const [group, setGroup] = useState(0);

    function changeAsset(asset:any) {
        handleAssetChange(asset);
    }

    return (
        <div className="left_mprice_box" style={{height: '600px'}}>
            <div className="select_box" id="select_box2">
                <div className="dropdownbox">
                    <img src="assets/images/coin1.svg" alt="" />
                    <p>Markets</p>
                </div>
            </div>

            <div className="search_box">
                <form action="" method="">
                    <div className="search">
                        <input type="text" placeholder="Search a specific pair...." />
                        <button type="submit"><img src="assets/images/search.svg" alt="" /></button>
                    </div>
                </form>
            </div>

            <div className="price_area">
                <div className="nav" id="nav-tab" role="tablist">
                    <button className="active btn-tab" id="con_1" data-bs-toggle="tab" type="button" role="tab" aria-controls="conver1" aria-selected="true" onClick={()=>setGroup(0)}>
                        USD Pairs
                    </button>

                    <button className="btn-tab" id="con_2" data-bs-toggle="tab" type="button" role="tab" aria-controls="conver1" aria-selected="true" onClick={()=>setGroup(1)}>
                        BTC Pairs
                    </button>

                    <button className="btn-tab" id="con_3" data-bs-toggle="tab" type="button" role="tab" aria-controls="conver1" aria-selected="true" onClick={()=>setGroup(2)}>
                        Forex
                    </button>

                    <button className="btn-tab" id="con_4" data-bs-toggle="tab" type="button" role="tab" aria-controls="conver1" aria-selected="true" onClick={()=>setGroup(3)}>
                        Commodities
                    </button>
                </div>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" style={{paddingBottom: '8px'}}>
                        <div className="price_table" style={{overflowY: "scroll", paddingBottom: '10px', height: '440px'}}>
                            <div className="t_head">
                                <div className="t_col_a_1">
                                    <div className="t_title" style={{paddingLeft: "10px"}}>
                                        <span> ASSET</span>
                                    </div>
                                </div>

                                <div className="t_col_a_2">
                                    <div className="t_title">
                                        <span> PRICE</span>
                                    </div>
                                </div>

                                <div className="t_col_a_3">
                                    <div className="t_title">
                                        <span> 24hr</span>
                                    </div>
                                </div>
                            </div>

                            {
                                group == 0 ? (
                                    <>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"BTC/USD"} currentNetwork={currentNetwork} id={0} dec={currentNetwork.assets[0].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ETH/USD"} currentNetwork={currentNetwork} id={1} dec={currentNetwork.assets[1].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ADA/USD"} currentNetwork={currentNetwork} id={14} dec={currentNetwork.assets[14].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ALGO/USD"} currentNetwork={currentNetwork} id={30} dec={currentNetwork.assets[30].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ATOM/USD"} currentNetwork={currentNetwork} id={15} dec={currentNetwork.assets[15].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"AVAX/USD"} currentNetwork={currentNetwork} id={26} dec={currentNetwork.assets[26].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"BCH/USD"} currentNetwork={currentNetwork} id={21} dec={currentNetwork.assets[21].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"BNB/USD"} currentNetwork={currentNetwork} id={13} dec={currentNetwork.assets[13].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"DOGE/USD"} currentNetwork={currentNetwork} id={19} dec={currentNetwork.assets[19].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"DOT/USD"} currentNetwork={currentNetwork} id={23} dec={currentNetwork.assets[23].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ETC/USD"} currentNetwork={currentNetwork} id={22} dec={currentNetwork.assets[22].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"HBAR/USD"} currentNetwork={currentNetwork} id={16} dec={currentNetwork.assets[16].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ICP/USD"} currentNetwork={currentNetwork} id={31} dec={currentNetwork.assets[31].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"LINK/USD"} currentNetwork={currentNetwork} id={4} dec={currentNetwork.assets[4].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"LTC/USD"} currentNetwork={currentNetwork} id={20} dec={currentNetwork.assets[20].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"MATIC/USD"} currentNetwork={currentNetwork} id={3} dec={currentNetwork.assets[3].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"NEAR/USD"} currentNetwork={currentNetwork} id={29} dec={currentNetwork.assets[29].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"SHIB/USD"} currentNetwork={currentNetwork} id={25} dec={currentNetwork.assets[25].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"SOL/USD"} currentNetwork={currentNetwork} id={18} dec={currentNetwork.assets[18].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"TRX/USD"} currentNetwork={currentNetwork} id={17} dec={currentNetwork.assets[17].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"UNI/USD"} currentNetwork={currentNetwork} id={27} dec={currentNetwork.assets[27].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"XLM/USD"} currentNetwork={currentNetwork} id={28} dec={currentNetwork.assets[28].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"XMR/USD"} currentNetwork={currentNetwork} id={24} dec={currentNetwork.assets[24].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"XRP/USD"} currentNetwork={currentNetwork} id={12} dec={currentNetwork.assets[12].decimals}/>
                                    </>
                                ) : group == 1 ? (
                                    <>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"ETH/BTC"} currentNetwork={currentNetwork} id={11} dec={currentNetwork.assets[11].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"LINK/BTC"} currentNetwork={currentNetwork} id={33} dec={currentNetwork.assets[33].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"XMR/BTC"} currentNetwork={currentNetwork} id={34} dec={currentNetwork.assets[34].decimals}/>
                                    </>
                                ) : group == 2 ? (
                                    <>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"CAD/USD"} currentNetwork={currentNetwork} id={10} dec={currentNetwork.assets[10].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"EUR/USD"} currentNetwork={currentNetwork} id={5} dec={currentNetwork.assets[5].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"GBP/USD"} currentNetwork={currentNetwork} id={6} dec={currentNetwork.assets[6].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"JPY/USD"} currentNetwork={currentNetwork} id={7} dec={currentNetwork.assets[7].decimals}/>
                                        
                                        {/*<Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"RUB/USD"} currentNetwork={currentNetwork} id={8} dec={currentNetwork.assets[8].decimals}/>*/}
                                    </>
                                ) : (
                                    <>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"XAG/USD"} currentNetwork={currentNetwork} id={32} dec={currentNetwork.assets[32].decimals}/>
                                        <Asset cPrice={cPrice} oPrice={oPrice} changeAsset={changeAsset} name={"XAU/USD"} currentNetwork={currentNetwork} id={2} dec={currentNetwork.assets[2].decimals}/>
                                    </>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}