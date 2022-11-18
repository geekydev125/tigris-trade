import React, { useContext, useCallback, useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { useDisclosure } from "@chakra-ui/react";
import EditPositionModal from './EditPositionModal'
import { getPrice, checkSigs, getData } from '../../../price_handle/index';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

interface PosProps {
    user: String,
    openPrice: number,
    leverage: Number,
    margin: any,
    takeProfit:any,
    stopLoss:any,
    index:Number,
    type:boolean,
    cPrice:any,
    asset:any,
    addToast:Function,
    editToast:Function,
    accInterest:any,
    currentNetwork:any,
    setPending:any,
    updatePos:any,
    isAfterFees:boolean
}

const Position : React.FC<PosProps> = ({user, openPrice, leverage, margin, takeProfit, stopLoss, index, type, cPrice, asset, addToast, editToast, accInterest, currentNetwork, setPending, updatePos, isAfterFees}) => { 

    function getTradingContract() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0) return undefined;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer);
    }

   const { address } = useAccount();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [liq, setLiq] = useState(0);
    const [pnl, setPnl] = useState(0);
    const [pnlValue2, setPnlValue2] = useState("0");

    const [countdown, setCountdown] = useState("90");

    async function getLiq() {
        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        let tradingLibrary = new web3.eth.Contract(currentNetwork.abis.tradinglibrary as AbiItem[], currentNetwork.addresses.tradinglibrary);

        let liqPrice = await tradingLibrary.methods.getLiqPrice(currentNetwork.addresses.positions, index, 9e9).call();
        setLiq(liqPrice);
    }

    useEffect(() => {
        if(!currentNetwork || currentNetwork.network_id === 0) return;    
        getLiq();
    }, [index, margin])

    async function initClosePosition(){   
        try {

            var tradingContractSend = getTradingContract();

            var toastId:any = addToast("Getting live prices...")

            var fSigs:any = await getData(asset);

            console.log("x", fSigs);
            if(!fSigs) {
                var price = await getPrice(asset);
                fSigs = await checkSigs(price);
            }

            var closed: boolean = false;

            let priceData:any = [];
            let allSigs:any = [];

            for(var i=0; i<fSigs.length; i+=5) {
                let onePriceData = [
                    fSigs[i+3],
                    asset,
                    fSigs[i+1],
                    fSigs[i+2],
                    fSigs[i+4]
                ];
                priceData.push(onePriceData);
                allSigs.push(fSigs[i]);
                if (fSigs[i+4] == true) {
                    closed = true;
                    break;
                }
            }
            if (closed) {
                toastId = editToast(toastId, "Cannot trade while market is closed");
                return;
            }

            setPending(fSigs[1]/1e18);

            toastId = editToast(toastId, "Please confirm the transaction within 10 seconds.");

            try {
                if (tradingContractSend == undefined) {
                  throw "No trading contract available";
                }
                let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
                let tx = await tradingContractSend?.initiateCloseOrder(index, 1e10, priceData, allSigs, currentNetwork.addresses.tigusdvault, currentNetwork.addresses.tigusd, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
                editToast(toastId, "Order sent with price $"+ parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(currentNetwork.assets[asset].decimals));
                setPending(0);

                await tx.wait();
                localStorage.removeItem(index.toString());
                updatePos();
                const saveIsAfterFees = isAfterFees;
                isAfterFees = true;
                editToast(toastId, "Position closed with price $"+ parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(currentNetwork.assets[asset].decimals) + " ("+calculatePnLWithValue(fSigs[1]/1e18).toFixed(2)+"%) (~$"+pnlValueWithValue(fSigs[1]/1e18)+")");
                isAfterFees = saveIsAfterFees;
                
                console.log(`Mined, hash: ${tx.hash}`);
                console.log(`closed:`);

            } catch(e:any) {
                if (e.reason == null) {
                    editToast(toastId, "Transaction was cancelled");
                } else {
                    editToast(toastId, "Error: " + e.reason);
                }
                setPending(0);
            }
        } catch(e:any) {
            editToast(toastId, "Error: "+e.reason);
            setPending(0);
        }
	}

    function pnlValue() {
        return parseFloat((margin + margin * calculatePnL()/100).toString()).toFixed(2);
    }

    function pnlValueWithValue(cPrice:any) {
        return parseFloat((margin + margin * calculatePnLWithValue(cPrice)/100).toString()).toFixed(2);
    }

    function calculatePnL() {
        return calculatePnLWithValue(cPrice);
  	}

    function calculatePnLWithValue(cPrice:any) {

        var interest = accInterest/1e18;
        var lev = parseFloat(leverage.toString());

        var fee:any;
        if (isAfterFees) {
            fee = (margin*lev*cPrice/openPrice) * parseFloat(currentNetwork.assets[asset].fee);
        } else {
            fee = 0;
        }

        var payoutAfterFee:any = type ? (margin + (cPrice/openPrice-1)*lev*margin+interest-fee) : (margin + (openPrice/cPrice-1)*lev*margin+interest-fee);

        var pnlPercent = ((payoutAfterFee)/margin-1)*100;
        if (pnlPercent > 500) {
            pnlPercent = 500;
        }
        return pnlPercent;
  	}

    useEffect(() => {
        setPnl(parseFloat(calculatePnL().toFixed(2)));
        setPnlValue2(pnlValue());
    }, [cPrice]);

    useEffect(()=>{
        let interval = setInterval(() => { getLiq(); }, 5000);

        return() => {
            clearInterval(interval);
        }
  	}, [currentNetwork]);

    useEffect(() => {
        let countdownJson = localStorage.getItem(index.toString());
        if (countdownJson != null) {
            let countdownStorage = JSON.parse(countdownJson);
            if (countdownStorage != null) {
                setCountdown(countdownStorage);
            }
        }
    }, []);

    useEffect(()=>{
        let interval = setInterval(() => {
            if (countdown != "Close") {
                if (parseInt(countdown) > 0) {
                    setCountdown((parseInt(countdown)-1).toString());
                    localStorage.setItem(index.toString(), JSON.stringify(countdown));
                } else {
                    setCountdown("Close");
                    localStorage.setItem(index.toString(), JSON.stringify("Close"));
                    clearInterval(interval);
                }
            }
        }, 1000);
        return() => {
            clearInterval(interval);
        }
    }, [countdown]);

    const [triggerAnimation, doTriggerAnimation] = useState(-1);

    async function updateAnimate() {
        doTriggerAnimation(Math.random());
    }

    function endAnimation() {
        doTriggerAnimation(2);
    }

    return (
        <div className="pwt_body" key={triggerAnimation} style={{animation: triggerAnimation == -1 ? "fadeInInit 0.5s" : (triggerAnimation == 2 ? "" : "fadeInUpdate 0.8s")}} onAnimationEnd={endAnimation}>
            <div className="pwt_col_1">
                <div className="pwt_title">
                    <h1>{user != address ? (user ? user.slice(0,8) : "") : ("You")}</h1>
                </div>
            </div>

            <div className="pwt_col_2">
                <div className="pwt_title">
                    <p>${margin.toFixed(2)}</p>
                </div>
            </div>

            <div className="pwt_col_3">
                {type ? (
                    <div className="pwt_title">
                        <p>{currentNetwork.assets[asset].name}</p>
                    </div>
                ) : (
                    <div className="pwt_title c_1">
                        <p>{currentNetwork.assets[asset].name}</p>
                    </div>
                )}
                
            </div>

            <div className="pwt_col_4">
                <div className="pwt_title">
                    <p>{leverage.toFixed(2)}x</p>
                </div>
            </div>

            <div className="pwt_col_5">
                <div className="pwt_title">
                    <p>{openPrice.toFixed(currentNetwork.assets[asset].decimals)}</p>
                </div>
            </div>

            <div className="pwt_col_6">
                
                    {pnl < 0 ? ( 
                        <div className="pwt_title c_1">
                            <OverlayTrigger
                                key={'top'}
                                placement={'top'}
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        ${
                                            pnlValue()
                                        }
                                    </Tooltip>
                                }
                            >
                                <p>{pnl}%</p>
                            </OverlayTrigger>
                        </div>
                    ) : (
                        <div className="pwt_title c_2">
                            <OverlayTrigger
                                key={'top'}
                                placement={'top'}
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        ${
                                            pnlValue()
                                        }
                                    </Tooltip>
                                }
                            >
                                <p>{pnl}%</p>
                            </OverlayTrigger>
                        </div> 
                    )}
            </div>

            <div className="pwt_col_7">
                <div className="pwt_title">
                    <p>{takeProfit == 0 ? "None" : takeProfit.toFixed(currentNetwork.assets[asset].decimals)}</p>
                </div>
            </div>

            <div className="pwt_col_8">
                <div className="pwt_title">
                    <p>{stopLoss == 0 ? "None" : stopLoss.toFixed(currentNetwork.assets[asset].decimals)}</p>
                </div>
            </div>

            <div className="pwt_col_9">
                <div className="pwt_title">
                    <p>{(liq/1e18).toFixed(currentNetwork.assets[asset].decimals)}</p>
                </div>
            </div>

            <div className="pwt_col_10">
                {user == address ? (
                <div className="pwt_title">
                    <div className="button_box_small" onClick={countdown == "Close" ? initClosePosition : undefined} style={{float: "left"}}>
                        <a className="primary_button_small" style={{background: countdown == "Close" ? "white" : "gray", borderColor: countdown == "Close" ? "white" : "gray"}}>{countdown}</a>
                    </div>
                    <div className="button_box_small" onClick={onOpen} style={{float: "left"}}>
                        <a className="primary_button_small" style={{background: countdown == "Close" ? "white" : "gray", borderColor: countdown == "Close" ? "white" : "gray"}}>Edit</a>
                    </div>
                    <EditPositionModal
                        isOpen={isOpen}
                        onClose={onClose}
                        Id={index}
                        sl={stopLoss}
                        tp={takeProfit}
                        direction={type} 
                        currentPrice={cPrice}
                        openPrice={openPrice} 
                        margin={margin}
                        lev={leverage} 
                        asset={asset}
                        addToast={addToast}
                        editToast={editToast}
                        currentNetwork={currentNetwork}
                        pnlValue={pnlValue2}
                        accInterest={accInterest}
                        updatePos={updatePos}
                        updateAnimation={updateAnimate}
                        isAfterFees={isAfterFees}
                    />
                </div> ) : (
                    <></>
                )}
            </div>
        </div>
  );
}

export default Position;