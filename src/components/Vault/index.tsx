import { useEffect, useState, useCallback } from 'react';
import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Center } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

declare var window: any
const { ethereum } = window;

export default function Vault(Props:any) {

    let currentNetwork = Props.currentNetwork;
    let DAI:any;
    let tigUSD:any;
    let StakingValue:any;

    const { address } = useAccount();

    const [isTigToDai, setIsTigToDai] = useState(false);
    const [daiBalance, setDaiBalance] = useState(0);
    const [tigusdBalance, setTigusdBalance] = useState(0);
    const [isDaiAllowed, setIsDaiAllowed] = useState(false);
    const [isTigUSDAllowed, setIsTigUSDAllowed] = useState(false);
    const [vaultBalance, setVaultBalance] = useState(0);
    const [tigUSDSupply, setTigUSDSupply] = useState(0);
    const [vaultPercent, setVaultPercent] = useState("100");

    const [useMax, setUseMax] = useState(true);

    const [useMaxStaking, setUseMaxStaking] = useState(false);
    const [stakingAmount, setStakingAmount] = useState(0);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [pendingReward, setPendingReward] = useState(0);
    const [totalStaked, setTotalStaked] = useState(0);

    function handletigUSDChange(event:any) {
        var v = event.target.value
        DAI.value = v;
        setUseMax(false);
    }

    function handleDAIChange(event:any) {
        var v = event.target.value
        tigUSD.value = v;
        setUseMax(false);
    }

    function handleStakingChange(event:any) {
        var v = event.target.value
        StakingValue.value = v;
        setUseMaxStaking(false);
    }

    function handleSwapSwap() {
        setIsTigToDai(!isTigToDai);
        setUseMax(false);
    }

    async function getDAIAllowance() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0 || !address) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);

        let allowance = await daiContract.methods.allowance(address, currentNetwork.addresses.tigusdvault).call();
        if(allowance != 0) setIsDaiAllowed(true);
    }

    async function getTigUSDAllowance() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0 || !address) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const tigusdContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.addresses.tigusd);

        let allowance = await tigusdContract.methods.allowance(address, currentNetwork.addresses.staking).call();
        if(allowance != 0) setIsTigUSDAllowed(true);
    }

    async function getInfo() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0 || !address) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);
        const tigUSDContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.addresses.tigusd);
        const stakingContract = new web3.eth.Contract(currentNetwork.abis.staking as AbiItem[], currentNetwork.addresses.staking); 

        let vaultBalance = await daiContract.methods.balanceOf(currentNetwork.addresses.tigusdvault).call();
        setVaultBalance(vaultBalance/10**currentNetwork.marginAssets[0].decimals);

        let supply = await tigUSDContract.methods.totalSupply().call();
        setTigUSDSupply(supply/1e18);

        setVaultPercent((parseFloat((vaultBalance*10**(18-currentNetwork.marginAssets[0].decimals)/supply*100).toString()).toFixed(2)));

        let userBalance = await daiContract.methods.balanceOf(address).call();
        setDaiBalance(userBalance/10**currentNetwork.marginAssets[0].decimals);

        let userTigBalance = await tigUSDContract.methods.balanceOf(address).call();
        setTigusdBalance(userTigBalance/1e18);
        
        let userStakedAmount = await stakingContract.methods.userStaked(address).call();
        setStakedAmount(userStakedAmount/1e18);

        let userPending = await stakingContract.methods.pending(address).call();
        setPendingReward(userPending/1e18);

        let totalStaked = await stakingContract.methods.totalStaked().call();
        setTotalStaked(totalStaked/1e18)
    }

    async function approveDAI() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const daiContract = new ethers.Contract(currentNetwork.marginAssets[0].address, currentNetwork.abis.erc20, signer); 

        let tx = await daiContract.approve(currentNetwork.addresses.tigusdvault, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        await tx.wait();
        getDAIAllowance();
    }

    async function approvetigUSD() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tigusdContract = new ethers.Contract(currentNetwork.addresses.tigusd, currentNetwork.abis.erc20, signer); 

        let tx = await tigusdContract.approve(currentNetwork.addresses.staking, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        await tx.wait();
        getTigUSDAllowance();
    }

    async function swap() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const vaultContract = new ethers.Contract(currentNetwork.addresses.tigusdvault, currentNetwork.abis.tigusdvault, signer); 

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);
        const tigUSDContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.addresses.tigusd);

        if (useMax) {
            if(isTigToDai) {
                let tx = await vaultContract.withdraw(currentNetwork.marginAssets[0].address, BigInt(await tigUSDContract.methods.balanceOf(address).call()));
                await tx.wait();
            } else {
                let tx = await vaultContract.deposit(currentNetwork.marginAssets[0].address, BigInt(await daiContract.methods.balanceOf(address).call()));
                await tx.wait();
            }              
        } else {
            if(isTigToDai) {
                let tx = await vaultContract.withdraw(currentNetwork.marginAssets[0].address, ethers.utils.parseEther(tigUSD.value));
                await tx.wait();
            } else {
                let tx = await vaultContract.deposit(currentNetwork.marginAssets[0].address, currentNetwork.marginAssets[0].decimals == 18 ? ethers.utils.parseEther(tigUSD.value) : Math.round(parseFloat(tigUSD.value)*10**currentNetwork.marginAssets[0].decimals));
                await tx.wait();
            }        
        }
        
        if(tigUSD) tigUSD.value = "";
        if(DAI) DAI.value = "";

        getInfo();
    }

    async function stake() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const stakingContract = new ethers.Contract(currentNetwork.addresses.staking, currentNetwork.abis.staking, signer); 

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const tigUSDContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.addresses.tigusd);

        if (useMaxStaking) {
            let tx = await stakingContract.deposit(BigInt(await tigUSDContract.methods.balanceOf(address).call()));
            await tx.wait();
        } else {
            let tx = await stakingContract.deposit(ethers.utils.parseEther(StakingValue.value));
            await tx.wait();
        }
        getInfo();
    }

    async function claim() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const stakingContract = new ethers.Contract(currentNetwork.addresses.staking, currentNetwork.abis.staking, signer); 

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));

        let tx = await stakingContract.claim();
        await tx.wait();
        getInfo();
    }

    async function withdraw() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const stakingContract = new ethers.Contract(currentNetwork.addresses.staking, currentNetwork.abis.staking, signer); 

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));

        let tx = await stakingContract.withdrawAll();
        await tx.wait();
        getInfo();
    }

    useEffect(() => {
        currentNetwork = Props.currentNetwork;
        getInfo();
        getDAIAllowance();
        getTigUSDAllowance();
    }, [Props.currentNetwork, address]);

    function max() {
        tigUSD.value = isTigToDai ? tigusdBalance : daiBalance;
        DAI.value = isTigToDai ? tigusdBalance : daiBalance;
        setUseMax(true);
    }

    function maxStaking() {
        if (tigusdBalance > 200000-totalStaked) {
            StakingValue.value = 200000-totalStaked
        } else {
            StakingValue.value = tigusdBalance;
        }
        setUseMaxStaking(true);
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>{vaultBalance.toFixed(0) + " " + currentNetwork.marginAssets[0].name}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>Vault Balance</h6></Center>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>{vaultPercent == 'NaN' ? 0 : vaultPercent}%</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>Vault Percentage</h6></Center>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>{tigUSDSupply.toFixed(0)} tigUSD</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>tigUSD Supply</h6></Center>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <div className='row'>
                            <Center><h1 style={{marginBottom: '80px'}}>USD Vault</h1></Center>
                            <div className='col-md-4'>
                                <div className='row'>
                                    <div className='col-md-auto'>
                                        <img src={isTigToDai ? "assets/images/tigUSD.svg" : currentNetwork.marginAssets[0].image} style={{width: '50px'}}/>
                                    </div>
                                    <div className='col'>
                                        <div className="value">
                                            <input type="number" style={{minWidth: '100%', height: '50px'}} ref={ref => tigUSD = ref} onChange={handletigUSDChange} placeholder="0.00"/>
                                            <button style={{width: '50px', height: '35px'}} onClick={max}>max</button>
                                        </div>
                                        <p style={{margin: '5px', color: '#636363'}}>Balance: {isTigToDai ? tigusdBalance.toFixed(2) + " tigUSD" : daiBalance.toFixed(2) + " " + currentNetwork.marginAssets[0].name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <Center><img style={{width: '40px', cursor: 'pointer', marginTop: '10px'}} src='assets/images/arrow.png' onClick={handleSwapSwap} /></Center>
                            </div>
                            <div className='col-md-4'>
                                <div className='row'>
                                    <div className='col-md-auto'>
                                        <img src={!isTigToDai ? "assets/images/tigUSD.svg" : currentNetwork.marginAssets[0].image} style={{width: '50px'}}/>
                                    </div>
                                    <div className='col'>
                                        <div className="value">
                                            <input type="number" style={{minWidth: '100%', height: '50px'}} ref={ref => DAI = ref} onChange={handleDAIChange} placeholder="0.00" disabled/>
                                            <button style={{width: '50px', height: '35px', cursor: 'default'}}>{!isTigToDai ? "tigUSD" : currentNetwork.marginAssets[0].name}</button>
                                        </div>
                                        <p style={{margin: '5px', color: '#636363'}}>Balance: {!isTigToDai ? tigusdBalance.toFixed(2) + " tigUSD" : daiBalance.toFixed(2) + " " + currentNetwork.marginAssets[0].name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="vault_button" style={{marginTop: '40px'}}>
                            <button className="buttons" onClick={() => {(!isTigToDai && !isDaiAllowed) ? approveDAI() : swap()}}>
                                {currentNetwork.name != "Unsupported" ? (!isTigToDai && !isDaiAllowed) ? "Approve" : "Swap" : "Unsupported Network"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {
                currentNetwork.network_id != 137 ? (<></>) : (
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="price_wave_area" style={{padding: '30px'}}>
                            <div className='row'>
                                <Center><h1 style={{marginBottom: '80px'}}>tigUSD Staking</h1></Center>
                                <div className='col-md-6' style={{width: "60%"}}>
                                    <div className='row'>
                                        <div className='col-md-auto'>
                                            <img src={"assets/images/tigUSD.svg"} style={{width: '50px'}}/>
                                        </div>
                                        <div className='col'>
                                            <div className="value">
                                                <input type="number" style={{minWidth: '100%', height: '50px'}} ref={ref => StakingValue = ref} onChange={handleStakingChange} placeholder="0.00"/>
                                                <button style={{width: '50px', height: '35px'}} onClick={maxStaking}>max</button>
                                            </div>
                                            <p style={{margin: '5px', color: '#636363'}}>Balance: {tigusdBalance.toFixed(2) + " tigUSD"}</p>
                                            <p style={{margin: '5px', color: '#636363'}}>Your stake: {stakedAmount.toFixed(2) + " tigUSD"}</p>
                                            <p style={{margin: '5px', color: '#636363'}}>Total staked: {totalStaked.toFixed(2) + "/200k tigUSD"}</p>
                                            <div className='row'>
                                                <div className='col'>
                                                    <div className="vault_button" style={{marginTop: '0px'}}>
                                                        <button className="buttons" onClick={() => {!isTigUSDAllowed ? approvetigUSD() : stake()}}>
                                                            {currentNetwork.name != "Unsupported" ? !isTigUSDAllowed ? "Approve tigUSD" : "Stake" : "Unsupported Network"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='col'>
                                                    <div className="vault_button" style={{marginTop: '0px'}}>
                                                        <button className="buttons" onClick={() => {withdraw()}}>
                                                            {currentNetwork.name != "Unsupported" ? "Withdraw all" : "Unsupported Network"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6' style={{width: "40%"}}>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className="value">
                                                <input type="number" style={{minWidth: '100%', height: '50px'}} placeholder={pendingReward.toString()} disabled/>
                                                <button style={{width: '50px', height: '35px', cursor: 'default'}}>{"tigUSD"}</button>
                                            </div>
                                            <div className="vault_button" style={{marginTop: '92px'}}>
                                                <button className="buttons" onClick={() => {claim()}}>
                                                    {currentNetwork.name != "Unsupported" ? "Claim" : "Unsupported Network"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        </div>
    );
  }