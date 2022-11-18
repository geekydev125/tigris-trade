import { useContext, useEffect, useState, useCallback } from 'react';
import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import { ethers } from 'ethers';
import PositionItem from './components/PositionItem'
import LimitPositionItem from './components/LimitPositionItem'
import { updatePostfix } from 'typescript';
import { MDBSwitch } from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

interface PosProps {
    cPrice:any,
    addToast:Function,
    editToast:Function,
    currentNetwork:any,
    setPending:any,
}

export default function Positions({cPrice, addToast, editToast, currentNetwork, setPending} : PosProps) {


    const { address } = useAccount();

    var positionContract:any;

    const [oldPositions, setOldPositions] = useState([]);
    const [openPositions, setOpenPositions] = useState(Array());
    const [limitOrders, setLimitOrders] = useState(Array());
    const [allPositions, setAllPositions] = useState(Array());
    const [activePositionsButton, setActivePositionsButton] = useState('yours');
    const [isAfterFees, setIsAfterFees] = useState(false);

    async function handleToggle() {
        setIsAfterFees(!isAfterFees);
    }


    async function getPositionsIndex(posUpdated: boolean){
        if(!currentNetwork || currentNetwork.network_id == 0) return;
        if(positionContract == undefined) {
            const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
            positionContract = new web3.eth.Contract(currentNetwork.abis.positions as AbiItem[], currentNetwork.addresses.positions);
        }

        const userTrades = address !== undefined ? await positionContract.methods.userTrades(address).call() : [];

        if(!arraysEqual(userTrades, oldPositions) || posUpdated) {
            
            let posPromisesIndex = [];
            for(var i = 0; i < userTrades.length; i++) {
                posPromisesIndex.push(positionContract.methods.trades(userTrades[i]).call());
            }

            Promise.all(posPromisesIndex).then((s) => {
                let openP: any[] = [];
                let limitO: any[] = [];

                for(var i = 0; i < s.length; i++) {
                    if(s[i].orderType == 0) {
                        openP.push(s[i]);
                    } else {
                        limitO.push(s[i]);
                    }
                }
                setOpenPositions(openP);
                setLimitOrders(limitO);
                setOldPositions(userTrades);
            });
        }
        try {
            let positionsdata: string = "";
            if (currentNetwork.network_id == 137) {
                positionsdata = "https://tigristrade.info/stats/open_positions"
            } else if (currentNetwork.network_id == 42161) {
                positionsdata = "https://tigristrade.info/stats/open_positions_arbi"
            }

            fetch(positionsdata)
            .then(response => {
                response.json().then(data => {
                    setAllPositions(data.positions);
                });
            });
        } catch {
            console.log("Failed to get all open positions");
        }
	}

    async function updatePos() {
        getPositionsIndex(true);
    }

    useEffect(()=>{
        getPositionsIndex(false);
        let interval = setInterval(() => { getPositionsIndex(false); }, 1000);

        return() => {
            clearInterval(interval);
        }
  	}, [currentNetwork, oldPositions, limitOrders, address])

    function arraysEqual(a:any, b:any) {

		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length !== b.length) return false;

		for (var i = 0; i < a.length; ++i) {
		    if (a[i] !== b[i]) return false;
		}
		return true;
	}

    return (
        <div className="price_wave_table">
            <div className="price_area">
                <div className="nav" id="nav-tab" role="tablist">
                    <button className="active" id="pt_1" data-bs-toggle="tab" data-bs-target="#ptb_1" type="button" role="tab" aria-controls="ptb_1" onClick={()=>setActivePositionsButton('yours')} aria-selected="true">My Open Positions</button>
                    <button id="pt_2" data-bs-toggle="tab" data-bs-target="#ptb_1" type="button" role="tab" aria-controls="ptb_1" aria-selected="false" onClick={()=>setActivePositionsButton('limit')}>My Limit Orders</button>
                    <button id="pt_3" data-bs-toggle="tab" data-bs-target="#ptb_1" type="button" role="tab" aria-controls="ptb_1" aria-selected="false" onClick={()=>setActivePositionsButton('all')}>All Open Positions</button>
                    <div style={{marginTop:'5px', fontSize:'14px', marginLeft:'4px', color:'grey'}}>
                        <MDBSwitch id='flexSwitchCheckDefault' inline label='Post-fees PNL' checked={isAfterFees} onChange={handleToggle}/>
                    </div>
                </div>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="ptb_1" role="tabpanel" aria-labelledby="pt_1">
                        <div className="pwt_box">
                            {
                                activePositionsButton==='limit' ? (
                                    <div className="pwt_head">

                                        <div className="pwt_limit_col_1">
                                            <div className="pwt_title">
                                                <span>MARGIN</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_2">
                                            <div className="pwt_title">
                                                <span>PAIR</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_3">
                                            <div className="pwt_title">
                                                <span>LEV</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_4">
                                            <div className="pwt_title">
                                                <span>ORDER TYPE</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_5">
                                            <div className="pwt_title">
                                                <span>TRIGGER PRICE</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_6">
                                            <div className="pwt_title">
                                                <span>TP</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_7">
                                            <div className="pwt_title">
                                                <span>SL</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_8">
                                            <div className="pwt_title">
                                                <span>TYPE</span>
                                            </div>
                                        </div>

                                        <div className="pwt_limit_col_9">
                                            <div className="pwt_title">
                                                <span>ACTION</span>
                                            </div>
                                        </div>
                                    </div>
                            ):(
                                <div className="pwt_head">
                                        <div className="pwt_col_1">
                                            <div className="pwt_title">
                                                <span>USER</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_2">
                                            <div className="pwt_title">
                                                <span>MARGIN</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_3">
                                            <div className="pwt_title">
                                                <span>PAIR</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_4">
                                            <div className="pwt_title">
                                                <span>LEV</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_5">
                                            <div className="pwt_title">
                                                <span>PRICE</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_6">
                                            <div className="pwt_title">
                                                <span>PNL</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_7">
                                            <div className="pwt_title">
                                                <span>TP</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_8">
                                            <div className="pwt_title">
                                                <span>SL</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_9">
                                            <div className="pwt_title">
                                                <span>LIQ</span>
                                            </div>
                                        </div>

                                        <div className="pwt_col_10">
                                            <div className="pwt_title">
                                                <span>ACTION</span>
                                            </div>
                                        </div>
                                </div>
                            )}

                            {
                                activePositionsButton==='yours' ? (openPositions).map((n:any)=>(
                                    <PositionItem 
                                        setPending={setPending}
                                        user={n.trader} 
                                        margin={parseFloat((n.margin/1e18).toFixed(2))} 
                                        leverage={n.leverage/1e18} 
                                        openPrice={parseFloat((n.price/1e18).toFixed(currentNetwork.assets[n.asset].decimals))} 
                                        takeProfit={n.tpPrice/1e18} 
                                        stopLoss={n.slPrice/1e18} 
                                        cPrice={cPrice[n.asset]} 
                                        type={n.direction} 
                                        index={n.id} 
                                        asset={n.asset}
                                        addToast={addToast}
                                        editToast={editToast}
                                        accInterest={n.accInterest}
                                        key={'my-'+n.id}
                                        currentNetwork={currentNetwork}
                                        updatePos={updatePos}
                                        isAfterFees={isAfterFees}
                                    />
                                ))
                                : (activePositionsButton==='limit' ?
                                    ((limitOrders).map((n:any)=>(
                                        <LimitPositionItem 
                                            user={n.trader} 
                                            margin={parseFloat((n.margin/1e18).toFixed(2))} 
                                            leverage={n.leverage/1e18} 
                                            orderType={n.orderType}
                                            openPrice={parseFloat((n.price/1e18).toFixed(currentNetwork.assets[n.asset].decimals))} 
                                            takeProfit={n.tpPrice/1e18} 
                                            stopLoss={n.slPrice/1e18}  
                                            type={n.direction} 
                                            index={n.id} 
                                            asset={n.asset}
                                            addToast={addToast}
                                            editToast={editToast}
                                            key={'limit-'+n.id}
                                            currentNetwork={currentNetwork}
                                        />
                                    ))
                                ) : 
                                (allPositions).map((n:any)=>(
                                    <PositionItem 
                                        setPending={setPending}
                                        user={n.trader} 
                                        margin={parseFloat(parseFloat((n.margin)).toFixed(2))} 
                                        leverage={parseFloat(parseFloat(n.leverage).toFixed(2))} 
                                        openPrice={parseFloat(parseFloat(n.open_price).toFixed(currentNetwork.assets[n.asset].decimals))} 
                                        takeProfit={parseFloat(parseFloat(n.tp).toFixed(currentNetwork.assets[n.asset].decimals))} 
                                        stopLoss={parseFloat(parseFloat(n.sl).toFixed(currentNetwork.assets[n.asset].decimals))} 
                                        cPrice={cPrice[n.asset]}
                                        type={parseInt(n.is_long) == 1 ? true : false} 
                                        index={n.id}
                                        asset={parseInt(n.asset)}
                                        addToast={addToast}
                                        editToast={editToast}
                                        accInterest={0}
                                        key={'my-'+n.id}
                                        currentNetwork={currentNetwork}
                                        updatePos={updatePos}
                                        isAfterFees={isAfterFees}
                                    />
                                )))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
