import React, { useContext, useCallback, useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

interface PosProps {
    user: String,
    openPrice: number,
    leverage: Number,
    margin: any,
    orderType: number,
    takeProfit:any,
    stopLoss:any,
    index:Number,
    type:String,
    asset:any,
    addToast:Function,
    editToast:Function,
    currentNetwork:any,
}

const LimitPosition : React.FC<PosProps> = ({user, openPrice, leverage, margin, orderType, takeProfit, stopLoss, index, type, asset, addToast, editToast, currentNetwork}) => {

    function getTradingContract() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0) return undefined;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer); 
    }

    const { address } = useAccount();

    const [sl, setSl] = useState(parseFloat(stopLoss));
    const [tp, setTp] = useState(parseFloat(takeProfit));

    async function initCancelOrder(){
        console.log(index);
        
        var toastId = await addToast("Please confirm the transaction.");

        try {
            var tradingContractSend = getTradingContract();
            if (tradingContractSend == undefined) {
              throw "No trading contract available";
            }
            let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
            let tx = await tradingContractSend?.cancelLimitOrder(index, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
            toastId = await editToast(toastId, "Confirming transaction...");
            await tx.wait();
            editToast(toastId, "Limit order is cancelled.");
            console.log(`Mined, hash: ${tx.hash}`);
		    console.log(`closed:`);
        } catch(e:any) {
            if (e.reason == null) {
                editToast(toastId, "Transaction was cancelled");
            } else {
                editToast(toastId, "Error: " + e.reason);
            }
        }
	}

    return (
        <div className="pwt_body" id="target" style={{animation: "fadeIn 0.5s"}}>

            <div className="pwt_limit_col_1">
                <div className="pwt_title">
                    <p>${margin}</p>
                </div>
            </div>

            <div className="pwt_limit_col_2">
                <div className="pwt_title">
                    <p>{currentNetwork.assets[asset].name}</p>
                </div>
            </div>

            <div className="pwt_limit_col_3">
                <div className="pwt_title">
                    <p>{`${leverage}`}x</p>
                </div>
            </div>

            <div className="pwt_limit_col_4">
                <div className="pwt_title">
                    <p>{orderType == 1 ? "LIMIT" : "STOP"}</p>
                </div>
            </div>

            <div className="pwt_limit_col_5">
                <div className="pwt_title">
                    <p>${openPrice}</p>
                </div>
            </div>

            <div className="pwt_limit_col_6">
                <div className="pwt_title">
                    <p>{tp == 0 ? "None" : tp.toFixed(2)}</p>
                </div>
            </div>

            <div className="pwt_limit_col_7">
                <div className="pwt_title">
                    <p>{sl == 0 ? "None" : sl.toFixed(2)}</p>
                </div>
            </div>

            <div className="pwt_limit_col_8">
                {type ? (
                    <div className="pwt_title">
                        <p>Long</p>
                    </div>
                ) : (
                    <div className="pwt_title c_1">
                        <p>Short</p>
                    </div>
                )}
                
            </div>

            <div className="pwt_limit_col_9">
                {user == address ? (
                <div className="pwt_title">
                    <div className="button_box_small" onClick={initCancelOrder} style={{float: "left"}}>
                        <a className="primary_button_small">Cancel</a>
                    </div>
                </div> ) : (
                    <></>
                )}
            </div>
        </div>
  );
}

export default LimitPosition;