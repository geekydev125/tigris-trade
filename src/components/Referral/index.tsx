import { useEffect, useState, useCallback } from 'react';
import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Center } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

export default function Referral(Props:any) {

    let currentNetwork = Props.currentNetwork;

    const { address } = useAccount();

    const [code, setCode] = useState("");
    const [codes, setCodes] = useState([""]);
    const [addresses, setAddresses] = useState([""]);
    const [addNumber, setAddNumber] = useState(0);
    const [volume, setVolume] = useState(0);

    function handleCodeChange(event:any) {
        var v = event.target.value
        v = v.replace(/\W/g, '');

        event.target.value = v;
        setCode(v); 
    }

    async function getInfo() {
        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/refcodes/'+address)
        .then(response => {
            response.json().then(data => {

                var info = data.data;
                let c = [];
                for(var i=0; i<info.length; i++) {
                    c.push(info[i].code);
                }
                setCodes(c);
            });
        });

        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/refvolume/'+address)
        .then(response => {
            response.json().then(data => {

                var vol = data.info.volume;
                setVolume(vol);
            });
        });

        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/refaddresses/'+address)
        .then(response => {
            response.json().then(data => {

                var info = data.data;
                let c = [];
                for(var i=0; i<info.length; i++) {
                    c.push(info[i].trader);
                }
                setAddresses(c);
                setAddNumber(c.length);
            });
        });
    }

    async function create() {
        if(code.length < 1) return;
        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/addcode/'+code)
        .then(async response => {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const ref = new ethers.Contract(currentNetwork.addresses.referrals, currentNetwork.abis.referrals, signer); 

            let tx = await ref.createReferralCode(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(code)));
            await tx.wait();
            getInfo();
            setTimeout(() => getInfo(), 5000);
        });
    }

    useEffect(() => {
        getInfo();
    }, []);

    useEffect(() => {
        currentNetwork = Props.currentNetwork;
    }, [Props.currentNetwork, address]);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-8'>
                    <div className="price_wave_table">
                        <div className="price_area">
                            <div className="nav" id="nav-tab" role="tablist">
                                <button className="active" id="pt_1" data-bs-toggle="tab" data-bs-target="#ptb_1" type="button" role="tab" aria-controls="ptb_1" aria-selected="true">Your Links</button>
                            </div>

                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="ptb_1" role="tabpanel" aria-labelledby="pt_1">
                                    {
                                        codes.length > 0 && codes[0] != "" ? (codes).map((n:any,index) => (
                                            index+1 == codes.length ? (
                                                <div style={{padding: '20px'}}>
                                                    https://app.tigris.trade/?ref={n}
                                                </div>
                                            ) : (
                                                <div style={{padding: '20px', borderBottom: '1px solid grey'}}>
                                                    https://app.tigris.trade/?ref={n}
                                                </div>
                                            )
                                        )) : (
                                            <div style={{padding: '20px'}}>
                                                <Center>No Links</Center>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="price_wave_table">
                        <div className="price_area">
                            <div className="nav" id="nav-tab" role="tablist">
                                <button className="active" id="pt_1" data-bs-toggle="tab" data-bs-target="#ptb_1" type="button" role="tab" aria-controls="ptb_1" aria-selected="true">Referred Addresses</button>
                            </div>

                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="ptb_1" role="tabpanel" aria-labelledby="pt_1">
                                    {
                                        addresses.length > 0 && addresses[0] != "" ? (addresses).map((n:any,index) => (
                                            index+1 == addresses.length ? (
                                                <div style={{padding: '20px'}}>
                                                    {n}
                                                </div>
                                            ) : (
                                                <div style={{padding: '20px', borderBottom: '1px solid grey'}}>
                                                    {n}
                                                </div>
                                            )
                                            
                                        )) : (
                                            <div style={{padding: '20px'}}>
                                                <Center>No Addresses</Center>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>${volume.toFixed(2)}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>Referred All-time Volume</h6></Center>
                    </div>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>${(volume*0.0001).toFixed(2)}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>Fees Earned</h6></Center>
                    </div>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>{addNumber}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>Referred Wallets</h6></Center>
                    </div>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>Create new link</h2></Center>
                        <Center>
                            <div className="value" style={{minWidth: '100%', marginTop: '20px'}}>
                                <input type="text" placeholder='ReferralCode' style={{minWidth: '100%', height: '50px'}} onChange={handleCodeChange} pattern="[a-zA-Z0-9]+" />
                            </div>
                        </Center>
                        <small style={{marginLeft: "3px"}}>https://app.tigris.trade/?ref={code}</small>
                        <button className="buttons" style={{marginTop: '20px'}} onClick={create}>
                                Create Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }