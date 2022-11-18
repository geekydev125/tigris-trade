import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

export default function SwapComponent(Props:any) {

    const { address } = useAccount();

    const [balance, setBalance] = useState(0);

    async function getBalance() {
        if(!address || !Props.currentNetwork || Props.currentNetwork.network_id == 0) return;
        const web3 = new Web3(new Web3.providers.HttpProvider(Props.currentNetwork.rpc));
        var tigusdContract:any = new web3.eth.Contract(Props.currentNetwork.abis.tigusd as AbiItem[], Props.currentNetwork.addresses.tigusd);
        var balance = await tigusdContract.methods.balanceOf(address).call();
        setBalance(balance);

        await new Promise(r => setTimeout(r, 15*1000));
        getBalance();
    }

    useEffect(() => {  
        getBalance();
    }, [address, Props.currentNetwork]);

    return (
        <div className="left_mprice_box">
            <div className="select_box" id="select_box2">
                <div className="dropdownbox">
                    <img src="assets/images/c9.svg" alt=""/>
                    <p>Vault</p>
                </div>
            </div>

            <div className="vault_box">
                {/* <div className="vault_items">
                    <div className="vault_title">
                        <img src="assets/images/v1.svg" alt=""/>
                        <h3>Deposit</h3>
                    </div>

                    <div className="vault_value">
                        <input type="text" defaultValue="0"/>
                        <button>Max</button>
                    </div>
                </div>

                <div className="vault_items">
                    <div className="vault_title">
                        <img src="assets/images/v2.svg" alt=""/>
                        <h3>Swap</h3>
                    </div>

                    <div className="vault_value">
                        <input type="text" defaultValue="0"/>
                        <button>Max</button>
                    </div>
                </div>

                <div className="vault_items">
                    <div className="vault_title">
                        <img src="assets/images/v3.svg" alt=""/>
                        <h3>Withdraw</h3>
                    </div>

                    <div className="vault_value">
                        <input type="text" defaultValue="0"/>
                        <button>Max</button>
                    </div>
                </div> */}
                <h6>Your tigUSD balance: <b>{(balance/1e18).toFixed(2)}</b></h6>
                {/* <div className="vault_button">
                    <button className="buttons" onClick={getTokens}>Get Tokens</button>
                </div> */}
            </div>
        </div>
    );
  }