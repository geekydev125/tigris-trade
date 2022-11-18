import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import { Center } from "@chakra-ui/react";
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

export default function TestnetFaucet() {

    const { address } = useAccount();

    const [claimable, setClaimable] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {  
        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/claimable/'+address)
        .then(response => {
            response.json().then(data => {
                var info = data.claimable;
                
                console.log(info);
                setClaimable(info);
            });
        });
    }, [address]);

    function getTokens() {
        if(!address) return;
        setLoading(true);
        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/claim/'+address)
        .then(response => {
            response.json().then(data => {             
                setClaimable(false);
                setLoading(false);
            });
        });
    }

    return (
        <div className="left_mprice_box">
            <div className="select_box" id="select_box2">
                <div className="dropdownbox">
                    <img src="assets/images/c9.svg" alt=""/>
                    <p>Faucet</p>
                </div>
            </div>

            <div className="vault_box">
                {address ? (
                    <h6>Your Address: <b>{address}</b></h6>
                ) : (
                    <Center>Please connect your wallet.</Center>
                )}
                <br></br>
                <p>Get test tokens to test, can only claim once. If you have any problem please send a message on Discord.</p>
                <div className="vault_button">
                    {claimable ? (
                        <button className="buttons" onClick={getTokens}>{ loading ? "Loading..." : "Get Test MATIC, DAI and tigUSD"}</button>
                    ) : (
                        <button className="buttons" style={{background: "grey"}} >Already Claimed</button>
                    )}
                    
                </div>
            </div>
        </div>
    );
  }