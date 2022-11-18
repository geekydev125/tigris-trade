import React, { useContext, useEffect, useCallback, useState, useRef } from 'react';
import { ethers } from 'ethers';
import { getPrice, checkSigs, getData } from '../../price_handle/index';
import { Center } from '@chakra-ui/react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { useCookies } from 'react-cookie';
import { type } from 'os';
import { useAccount, useNetwork } from 'wagmi';

declare var window: any
const { ethereum } = window;

interface PanelProps {
    cPrice:any,
    asset:any,
    setPending:any,
    addToast:Function,
    editToast:Function,
    currentNetwork:any,
}

export default function TradingPanel({cPrice, asset, setPending, addToast, editToast, currentNetwork}: PanelProps) {

    function getTradingContract() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0) return undefined;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer); 
    }

    var marginDOM:any;
    var marginSliderDOM:any;
    var levDOM:any;
    var levSliderDOM:any;
    var positionDOM:any;
    var orderTypeDOM:any;
    var openPriceDOM:any = {value: cPrice};
    var slSliderDOM:any;
    var slFixedDOM:any;
    var slNotFixedDOM:any = {value: ""};
    var tpFixedDOM:any;
    var tpNotFixedDOM:any = {value: ""};
    var tpSliderDOM:any;
    var slTextDOM:any;


    const { address } = useAccount();
    const { chain } = useNetwork();

    const [slPercent, setSlPercent] = useState(0);
    const [tpPercent, setTpPercent] = useState(0);
    const [lev, setLev] = useState(100);
    const [pSize, setPSize] = useState(500);
    const [isLong, setIsLong] = useState(true);
    const [isMarginErrorMin, setIsMarginErrorMin] = useState(false);
    const [isLeverageError, setIsLeverageError] = useState(false);
    const [isChainIdError, setIsChainIdError] = useState(false);
    const [isLimit, setIsLimit] = useState(0);
    const [limitOpenPrice, setLimitOpenPrice] = useState(0);
    const [isBalanceError, setIsBalanceError] = useState(true);
    const [isOIError, setIsOIError] = useState(true);
    const [isTpError, setIsTpError] = useState(false);

    const [slTextPercentage, setSlTextPercentage] = useState(0);
    const [slFixedPrice, setSlFixedPrice] = useState(0);
    const [isSlFixedPrice, setIsSlFixedPrice] = useState(false);

    const [tpTextPercentage, setTpTextPercentage] = useState(0);
    const [tpFixedPrice, setTpFixedPrice] = useState(0);
    const [isTpFixedPrice, setIsTpFixedPrice] = useState(false);
    
    const [shortAPRHourly, setShortAPRHourly] = useState(0);
    const [longAPRHourly, setLongAPRHourly] = useState(0);
    const [isMenu, setIsMenu] = useState(false);
    const [isTigUSDNotDai, setIsTigUSDNotDai] = useState(false);
    const [isDaiAllowed, setIsDaiAllowed] = useState(false);
    const [isMoreThanBalance, setIsMoreThanBalance] = useState(false);

    const [maxOi, setMaxOi] = useState(0);
    const [longOi, setLongOi] = useState(0);
    const [shortOi, setShortOi] = useState(0);

    const [minLev, setMinLev] = useState(1);
    const [maxLev, setMaxLev] = useState(1000);

    const [userBalance, setUserBalance] = useState("Loading");

    const [cookies, setCookie, removeCookie] = useCookies(['ref']);

    let dec = currentNetwork.assets[asset].decimals;
    
    useEffect(() => {
        if(chain?.id != 137 && chain?.id != 42161 && chain?.id != 421613) {
            setIsChainIdError(true);
        } else {
            setIsChainIdError(false);
        }
    }, [chain?.id]);

    useEffect(() => {
        getDAIAllowance();
        isTigUSDNotDai ? getTIGBalance() : getDAIBalance();
    }, [chain?.id, address, ethereum, isTigUSDNotDai, currentNetwork]);

    useEffect(() => {getDAIAllowance()}, []);

    async function getDAIBalance() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0 || address === undefined) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);

        let daiBalance = await daiContract.methods.balanceOf(address).call();
        setUserBalance((Math.floor(parseFloat((daiBalance/(10**(currentNetwork.marginAssets[0].decimals))).toString()) * 100) / 100).toString());
    }

    async function getTIGBalance() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0 || address === undefined) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const tigusdContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.addresses.tigusd);

        let tigusdBalance = await tigusdContract.methods.balanceOf(address).call();
        setUserBalance((Math.floor(parseFloat((tigusdBalance/1e18).toString()) * 100) / 100).toString());
    }

    async function getDAIAllowance() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0 || address === undefined) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);

        let allowance = await daiContract.methods.allowance(address, currentNetwork.addresses.trading).call();
        if(allowance != 0) setIsDaiAllowed(true);
    }

    useEffect(() => {
        getDAIAllowance();
    }, []);

    async function approveDAI() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const daiContract = new ethers.Contract(currentNetwork.marginAssets[0].address, currentNetwork.abis.erc20, signer); 
        let gasPriceEstimate = (await daiContract.provider.getGasPrice()).toNumber() * 1.25;
        let tx = await daiContract.approve(currentNetwork.addresses.trading, '115792089237316195423570985008687907853269984665640564039457584007913129639935', {gasPrice: gasPriceEstimate});
        await tx.wait();
        getDAIAllowance();
    }

    useEffect(() => {
        if(currentNetwork.network_id == 0) return;
        getFundingRate();
    }, [asset, currentNetwork]);

    useEffect(() => {
        if(pSize/lev > parseFloat(userBalance)) setIsBalanceError(true);
        else setIsBalanceError(false);

        if(isLong) {
            if((pSize + longOi/1e18 > maxOi/1e18) && maxOi != 0) {
                setIsOIError(true);
            } else setIsOIError(false);
        } else {
            if((pSize + shortOi/1e18 > maxOi/1e18) && maxOi != 0) {
                setIsOIError(true);
            } else setIsOIError(false);
        }
    }, [pSize, lev, userBalance, longOi, shortOi, isLong, maxOi]);

    async function getFundingRate() {
        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        let pairContract = new web3.eth.Contract(currentNetwork.abis.pairscontract as AbiItem[], currentNetwork.addresses.pairscontract);
        let tradingContract = new web3.eth.Contract(currentNetwork.abis.trading as AbiItem[], currentNetwork.addresses.trading);

        let pair = await pairContract.methods.idToAsset(asset).call();
        let minLev = parseFloat((parseFloat(pair.minLeverage)/1e18).toFixed(2));
        let maxLev = parseFloat((parseFloat(pair.maxLeverage)/1e18).toFixed(2));
        setMinLev(minLev);
        setMaxLev(maxLev);

        let oi = await pairContract.methods.idToOi(asset, currentNetwork.addresses.tigusd).call();
        let longOI = oi.longOi;
        let shortOI = oi.shortOi;
        let maxOI = oi.maxOi;
        let vaultFunding = 0;
        try {
            vaultFunding = await tradingContract.methods.vaultFundingPercent().call();
        } catch {
            vaultFunding = 0;
        }

        setLongOi(longOI);
        setShortOi(shortOI);
        setMaxOi(maxOI);

        let diff = longOI > shortOI ? longOI - shortOI : shortOI - longOI;

        let baseFunding = await pairContract.methods.idToAsset(asset).call();
        let baseFundingRate = baseFunding.baseFundingRate;
        let base = diff * baseFundingRate;

        let shortAPR = base/shortOI;
        let longAPR = base/longOI;

        if(longOI > shortOI) shortAPR = shortAPR * -1;
        else longAPR = longAPR * -1;

        let shortAPRHourly = shortAPR/365/24/1e8;
        let longAPRHourly = longAPR/365/24/1e8;

        if (longOI < shortOI) {
            longAPRHourly = longAPRHourly*(1e10-vaultFunding)/1e10;
        } else if (shortOI < longOI) {
            shortAPRHourly = shortAPRHourly*(1e10-vaultFunding)/1e10;
        }

        if(longOI == 0 && shortOI == 0) {
            setShortAPRHourly(0);
            setLongAPRHourly(0);
        } else {
            setShortAPRHourly(shortAPRHourly);
            setLongAPRHourly(longAPRHourly);
        }
    }

    function handleLevChange(event:any) {
        levDOM.value = event.target.value;
        positionDOM.value = parseFloat(levDOM.value)*parseFloat(marginDOM.value);
        setPSize(parseFloat(levDOM.value)*parseFloat(marginDOM.value));
        setLev(event.target.value);
        setIsLeverageError(false);
    }

    function handleLevTextChange(event:any) {
        event.target.value = event.target.value > maxLev ? maxLev : event.target.value;
        event.target.value < minLev ? setIsLeverageError(true) : setIsLeverageError(false);
        levSliderDOM.value = event.target.value;
        positionDOM.value = parseFloat(levDOM.value)*parseFloat(marginDOM.value);
        setPSize(parseFloat(levDOM.value)*parseFloat(marginDOM.value));
        setLev(event.target.value);
    }

    function handleMarginChange(event:any) {
        marginDOM.value = event.target.value;
        positionDOM.value = parseFloat(levDOM.value)*parseFloat(marginDOM.value);
        setPSize(parseFloat(levDOM.value)*parseFloat(marginDOM.value));
    }

    function handleMarginTextChange(event:any) {
        event.target.value = event.target.value > 5000 ? 5000 : event.target.value;
        marginSliderDOM.value = event.target.value;
        positionDOM.value = parseFloat(levDOM.value)*parseFloat(marginDOM.value);
        setPSize(parseFloat(levDOM.value)*parseFloat(marginDOM.value));
    }

    function checkMarginLimit() {
        if(pSize < currentNetwork.assets[asset].minPosition) {
            setIsMarginErrorMin(true);
        } else {
            setIsMarginErrorMin(false);
        }
    }

    useEffect(() => {
        checkMarginLimit();
    }, [pSize]);

    function handlePositionChange(event:any) {
        marginDOM.value = parseFloat(event.target.value)/parseFloat(levDOM.value);
        if (parseFloat(event.target.value) < currentNetwork.assets[asset].minPosition) {
            setIsMarginErrorMin(true);
        } else {
            setIsMarginErrorMin(false);
        }
    }

    async function handleOrderTypeChange(event:any) {
        setLimitOpenPrice(cPrice.toFixed(dec));
        setIsLimit(event.target.value);
    }

    async function handleLimitOpenPriceChange() {
        if (openPriceDOM.value == "") {
            setLimitOpenPrice(parseFloat("0"));
        } else {
            setLimitOpenPrice(parseFloat(openPriceDOM.value));
        }
    }

    async function initOpenPosition(){

        var margin = ethers.utils.parseEther(marginDOM.value);
        var leverage = ethers.utils.parseEther(levDOM.value);
        var direction = isLong;
        var oPrice = isLimit > 0 ? ethers.utils.parseEther(openPriceDOM.value) : 0;

        var tp = 
            isTpFixedPrice ? 
            ethers.utils.parseEther(tpFixedPrice > 0 ? tpFixedPrice.toString() : "0")
            :tpPercent == 0 ? 0 : isLong ? ethers.utils.parseEther((cPrice + (tpPercent/100)*cPrice/parseInt(lev.toString())).toString()) : ethers.utils.parseEther((cPrice - (tpPercent/100)*cPrice/parseInt(lev.toString())).toString());
        
        var sl = 
            isSlFixedPrice ? 
            ethers.utils.parseEther(slFixedPrice > 0 ? slFixedPrice.toString() : "0") 
            : slPercent == 0 ? 0 : isLong ? ethers.utils.parseEther((cPrice - (slPercent/100)*cPrice/parseInt(lev.toString())).toString()) : ethers.utils.parseEther((cPrice + (slPercent/100)*cPrice/parseInt(lev.toString())).toString());

        let tx;
        let ref = cookies.ref ? ethers.utils.keccak256(ethers.utils.toUtf8Bytes(cookies.ref)) : ethers.constants.HashZero;

        let tradeInfo = [
            margin,
            isTigUSDNotDai ? currentNetwork.addresses.tigusd : currentNetwork.marginAssets[0].address,
            currentNetwork.addresses.tigusdvault, 
            leverage, 
            asset,
            direction,
            tp,
            sl,
            ref
        ];

        try {
            var tradingContractSend = getTradingContract();

            var toastId:any = await addToast("Getting live prices...");

            var fSigs:any = await getData(asset);

            console.log("x", fSigs);
            if(!fSigs) {
                var price = await getPrice(asset);
                fSigs = await checkSigs(price);
            }

            setPending(fSigs[1]/1e18);

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
            }

            if(direction && parseInt(sl.toString()) > parseInt(fSigs[1]) && sl != 0) {
                toastId = await editToast(toastId, "SL price can't be more than open price.");
                setPending(0);
                return;
            } else if(!direction && parseInt(sl.toString()) < parseInt(fSigs[1]) && sl != 0) {
                toastId = await editToast(toastId, "SL price can't be less than open price.");
                setPending(0);
                return;
            }

            console.log(cPrice);
            console.log(parseFloat(oPrice.toString())/1e18);
            if(direction && isLimit == 1 && cPrice < parseFloat(oPrice.toString())/1e18) {
                toastId = await editToast(toastId, "Long limit order open price can't be higher than market price.");
                setPending(0);
                return;
            } else if(!direction && isLimit == 1 && cPrice > parseFloat(oPrice.toString())/1e18) {
                toastId = await editToast(toastId, "Short limit order open price can't be lower than market price.");
                setPending(0);
                return;
            } else if(direction && isLimit == 2 && cPrice > parseFloat(oPrice.toString())/1e18) {
                toastId = await editToast(toastId, "Long stop order open price can't be lower than market price.");
                setPending(0);
                return;
            } else if(!direction && isLimit == 2 && cPrice < parseFloat(oPrice.toString())/1e18) {
                toastId = await editToast(toastId, "Short stop order open price can't be higher than market price.");
                setPending(0);
                return;
            }

            toastId = await editToast(toastId, "Please confirm the transaction within 10 seconds.");

            try {
                var tradingContractSend = getTradingContract();
                if (tradingContractSend == undefined) {
                  throw "No trading contract available";
                }
                let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 1.5);
                if(isLimit == 0) {
                    tx = await tradingContractSend.initiateMarketOrder(tradeInfo, priceData, allSigs, [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false], {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0});
                } else {
                    tx = await tradingContractSend.initiateLimitOrder(tradeInfo, isLimit, oPrice, [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false], {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit, value: 0});
                }
                
                toastId = await editToast(toastId, "Order sent with price $" + parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(dec));
                setPending(0);
                await tx.wait();
                isTigUSDNotDai ? getTIGBalance() : getDAIBalance();
                if(isLimit == 0) {
                    editToast(toastId, "Position opened with price $"+ parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(dec));
                } else {
                    editToast(toastId, "Limit order is created.");
                }

                getFundingRate();
                console.log(`Mined, hash: ${tx.hash}`);
                console.log(`opened:`);
            } catch(e:any) {
                console.log("ERR");
                setPending(0);
                if (e.reason == null) {
                    editToast(toastId, "Transaction was cancelled");
                } else {
                    editToast(toastId, "Error: " + e.reason);
                }
                isTigUSDNotDai ? getTIGBalance() : getDAIBalance();
            }
            
        } catch(e:any) {
            console.log(e);
            console.log("ERR");
            setPending(1);
            editToast(toastId, "Error: "+ e.reason);
        }
	}

    useEffect(() => {
        var slInput = slFixedDOM ? parseFloat(slFixedDOM.value) : parseFloat(slNotFixedDOM.value);
        var tpInput = tpFixedDOM ? parseFloat(tpFixedDOM.value) : parseFloat(tpNotFixedDOM.value);
        
        var sl = slInput == 0 ? 0 : isLong ? parseInt(((cPrice-slInput)*lev*100/cPrice).toFixed(dec)) : parseInt(((slInput-cPrice)*lev*100/cPrice).toFixed(dec));
        var tp = tpInput == 0 ? 0 : !isLong ? parseInt(((cPrice-tpInput)*lev*100/cPrice).toFixed(dec)) : parseInt(((tpInput-cPrice)*lev*100/cPrice).toFixed(dec));

        setSlTextPercentage(sl);
        setTpTextPercentage(tp);
    }, [lev]);

    function handleSlTextChange(event:any) {
        changeSlIsFixed(true);
        var input = parseFloat(event.target.value);
        var sl = input == 0 ? 0 : isLong ? parseInt(((cPrice-input)*lev*100/cPrice).toFixed(dec)) : parseInt(((input-cPrice)*lev*100/cPrice).toFixed(dec));
        setSlTextPercentage(sl);
        setSlFixedPrice(input);
    }

    function handleTpTextChange(event:any) {
        changeTpIsFixed(true);
        var input = parseFloat(event.target.value);
        var tp = input == 0 ? 0 : !isLong ? parseInt(((cPrice-input)*lev*100/cPrice).toFixed(dec)) : parseInt(((input-cPrice)*lev*100/cPrice).toFixed(dec));
        setTpTextPercentage(tp);
        setTpFixedPrice(input);
        isLong ? (cPrice > input ? setIsTpError(true) : setIsTpError(false)) : (input > cPrice ? setIsTpError(true) : setIsTpError(false));
    }

    function handleSlChange(event:any) {
        changeSlIsFixed(false);
        setSlPercent(event.target.value);
        setSlTextPercentage(event.target.value);
    }

    function handleTpChange(event:any) {
        changeTpIsFixed(false);
        setTpPercent(event.target.value);
        setTpTextPercentage(event.target.value);
    }

    function changeSlIsFixed(b:any) {
        if(b) { //isFixed 
            var input = parseFloat(slNotFixedDOM.value);
            var sl = input == 0 ? 0 : isLong ? parseInt(((cPrice-input)*lev*100/cPrice).toFixed(dec)) : parseInt(((input-cPrice)*lev*100/cPrice).toFixed(dec));
            setSlTextPercentage(sl);
            setSlFixedPrice(input);
        }
        setIsSlFixedPrice(b);
    }

    function changeTpIsFixed(b:any) {
        if(b) { //isFixed 
            var input = parseFloat(tpNotFixedDOM.value);
            var tp = input == 0 ? 0 : !isLong ? parseInt(((cPrice-input)*lev*100/cPrice).toFixed(dec)) : parseInt(((input-cPrice)*lev*100/cPrice).toFixed(dec));
            setTpTextPercentage(tp);
            setTpFixedPrice(input);
            isLong ? (cPrice > input ? setIsTpError(true) : setIsTpError(false)) : (input > cPrice ? setIsTpError(true) : setIsTpError(false))
        } 
        setIsTpFixedPrice(b);
    }

    
    const numberToLetters = (n: number) => {
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    };
    
    let shortColor = shortAPRHourly <= 0 ? "green" : "red";
    let longColor = longAPRHourly <= 0 ? "green" : "red";

    useEffect(()=>{
        handleLevChange({target: {value: currentNetwork.assets[asset].defaultLev}});
        handleLevTextChange({target: {value: currentNetwork.assets[asset].defaultLev}});
        handleMarginChange({target: {value: currentNetwork.assets[asset].defaultMargin}});
        handleMarginTextChange({target: {value: currentNetwork.assets[asset].defaultMargin}});
        try {
            setLimitOpenPrice(cPrice.toFixed(dec));
        } catch {}
    }, [asset, currentNetwork]);

    return (
        <div>
            <div className="ls_tabs_box">
                <div className="ls_tab">
                    <ul>
                        <li><a rel="#ls_tabs1" className={ isLong ? "active" : "" } onClick={() => setIsLong(true)} style={{borderTopLeftRadius: '7px', borderBottomColor: isLong ? 'green' : 'black'}}>Long</a></li>
                        <li><a rel="#ls_tabs2" className={ isLong ? "" : "active" } onClick={() => setIsLong(false)} style={{borderTopRightRadius: '7px', borderBottomColor: isLong ? 'black' : 'red'}}>Short</a></li>
                    </ul>
                </div>

                <div className="ls_content">
                    <div className="ls_tabs_items tab_active" id="ls_tabs1">
                        <div className="ls_title">
                            <h2>Order Type:</h2>

                            <select ref={ref => orderTypeDOM = ref} onChange={handleOrderTypeChange} style={{border: '0px', maxWidth: '110px'}}>
                                <option value="0">Market</option>
                                <option value="1">Limit</option>
                                <option value="2">Stop</option>
                            </select>
                        </div>
                        {(isLimit > 0 ? 
                            <div className="ls_range_box">
                                <div className="ls_sub_title">
                                    <p>Open Price</p>

                                    <div className="value">
                                        <input type="text" defaultValue={limitOpenPrice} onChange={handleLimitOpenPriceChange} ref={ref => openPriceDOM = ref}/>
                                    </div>
                                </div>
                            </div>
                        : <></>)}
                        <div className="ls_range_box">
                            <div className="ls_sub_title">
                                <p>Position Size</p>

                                <div className="value">
                                    <input type="text" defaultValue="500" ref={ref => positionDOM = ref} onChange={handlePositionChange} />
                                    {/* <button type="submit">Max</button> */}
                                </div>
                            </div>
                        </div>

                        <div className="ls_range_box">
                            <div className="ls_sub_title">
                                <p>Leverage ({minLev.toString()}x-{maxLev.toString()}x)</p>

                                <div className="value">
                                    <input type="text" ref={ref => levDOM = ref} onChange={handleLevTextChange} defaultValue="100" />
                                </div>
                            </div>

                            <div className="range_slider">
                                <input className="range" ref={ref => levSliderDOM = ref} onChange={handleLevChange} type="range" defaultValue={currentNetwork.assets[asset].defaultLev} min={minLev} max={maxLev} />
                            </div>
                        </div>

                        <div className="ls_range_box">
                            <div className="ls_sub_title">
                                <p>Margin</p>

                                <div className="value">
                                    <input type="text" ref={ref => marginDOM = ref} defaultValue="5" onChange={handleMarginTextChange} />
                                </div>
                            </div>

                            <div className="range_slider">
                                <input className="range" ref={ref => marginSliderDOM = ref} type="range" onChange={handleMarginChange} defaultValue={currentNetwork.assets[asset].defaultMargin} min="5" max="5000" />
                            </div>
                        </div>

                        <div className="ls_range_box">
                            <div className="ls_sub_title">
                                <p>Liq Price ($)</p>

                                <div className="value">
                                    <input type="text" defaultValue="0" value=
                                    {
                                        isLimit == 0 ? (isLong ? parseFloat((cPrice - 90 / lev / 100 * cPrice).toString()).toFixed(dec) : parseFloat((cPrice + 90 / lev / 100 * cPrice).toFixed(dec)).toString()) :
                                        (isLong ? parseFloat((limitOpenPrice - 90 / lev / 100 * limitOpenPrice).toString()).toFixed(dec) : parseFloat((limitOpenPrice + 90 / lev / 100 * limitOpenPrice).toString()).toFixed(dec))
                                    }
                                    disabled/>
                                </div>
                            </div>
                        </div>

                        <div className="val_title" style={{marginTop: '10px'}}></div>

                        <div className="ls_range_box">
                            <div className="ls_sub_title">
                                <p>Stop Loss {slTextPercentage > 0 ? "(-"+slTextPercentage+"%)" : ""}</p>

                                <div className="value">
                                    {isSlFixedPrice ? (
                                        <input type="text" onChange={handleSlTextChange} ref={ref => slFixedDOM = ref} placeholder="0" />
                                    ) : (
                                        <input type="text" onChange={handleSlTextChange} ref={ref => slNotFixedDOM = ref} placeholder="0" value=
                                        {
                                            slPercent == 0 ? "" :
                                                isLimit == 0
                                                ?
                                                (isLong ? parseFloat((cPrice - cPrice * (slPercent/100) / lev).toString()).toFixed(dec) : parseFloat((cPrice + cPrice * (slPercent/100) / lev).toString()).toFixed(dec))
                                                :
                                                (isLong ? parseFloat((parseFloat(limitOpenPrice.toString()) - parseFloat(limitOpenPrice.toString()) * slPercent / 100 / lev).toString()).toFixed(dec) : parseFloat((parseFloat(limitOpenPrice.toString()) + parseFloat(limitOpenPrice.toString()) * slPercent / 100 / lev).toString()).toFixed(dec))
                                        } />
                                    )}
                                </div>
                            </div>
                            <div className="range_slider">
                                <input className="range" type="range" onChange={handleSlChange} ref={ref => slSliderDOM = ref} defaultValue="0" min="0" max="90" />
                            </div>
                        
                        </div>

                        <div className="stop_box">
                            <div className="ls_sub_title">
                                <p>Take Profit {tpTextPercentage > 0 ? "(+"+tpTextPercentage+"%)" : ""}</p>

                                <div className="value">
                                    {isTpFixedPrice ? (
                                        <input type="text" onChange={handleTpTextChange} ref={ref => tpFixedDOM = ref} placeholder="0" />
                                    ) : (
                                        <input type="text" onChange={handleTpTextChange} ref={ref => tpNotFixedDOM = ref} placeholder="0" value=
                                        {
                                            tpPercent == 0 ? "" :
                                                isLimit == 0
                                                ?
                                                (isLong ? parseFloat((cPrice + cPrice * (tpPercent/100) / lev).toString()).toFixed(dec) : parseFloat((cPrice - cPrice * (tpPercent/100) / lev).toString()).toFixed(dec))
                                                :
                                                (isLong ? parseFloat((parseFloat(limitOpenPrice.toString()) + parseFloat(limitOpenPrice.toString()) * tpPercent / 100 / lev).toString()).toFixed(dec) : parseFloat((parseFloat(limitOpenPrice.toString()) - parseFloat(limitOpenPrice.toString()) * tpPercent / 100 / lev).toString()).toFixed(dec))
                                        } />
                                    )}
                                </div>
                            </div>
                            <div className="range_slider">
                                <input className="range" type="range" onChange={handleTpChange} ref={ref => tpSliderDOM = ref} defaultValue="0" min="0" max="900" />
                            </div>
                        
                        </div>

                        <div className="val_title" style={{marginTop: '10px'}}></div>

                        <div className="ls_range_box">
                            <div className="ls_sub_title">
                                <p><small>Balance: {parseFloat(userBalance).toFixed(2)}</small></p>

                                <div>
                                    <div className="select_box" id="select_box3">
                                        <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '100px'}} onClick={() => setIsMenu(!isMenu)}>
                                            <img src={isTigUSDNotDai ? "assets/images/tigUSD.svg" : currentNetwork.marginAssets[0].image} alt="" />
                                            <p>{isTigUSDNotDai ? "tigUSD" : currentNetwork.marginAssets[0].name}</p>
                                        </div>

                                        <ul className={isMenu ? "dropdown_select showMenu" : "dropdown_select"}>
                                            <li onClick={() => {setIsTigUSDNotDai(false); setIsMenu(false)}}>
                                                <img src={currentNetwork.marginAssets[0].image} alt="" className="image"/>
                                                <p>{currentNetwork.marginAssets[0].name}</p>
                                            </li>
                                            <li onClick={() => {setIsTigUSDNotDai(true); setIsMenu(false)}}>
                                                <img src={"assets/images/tigUSD.svg"} alt="" className="image"/>
                                                <p>tigUSD</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <br></br>
                                </div>
                            </div>
                        </div>

                        <div className="vault_button">
                            {
                                (address === undefined || isChainIdError || isLeverageError || isMarginErrorMin || isBalanceError || currentNetwork.assets[asset].isClosed || isOIError || isTpError) ? (
                                    <button className="buttons" style={{background: 'grey'}}>{
                                    address === undefined ?
                                        "WALLET NOT CONNECTED" 
                                    : isChainIdError ? 
                                        "Unsupported Network" 
                                    : currentNetwork.assets[asset].isClosed ? 
                                        "MARKET CLOSED"
                                    : isLeverageError ? 
                                        "BELOW MIN LEVERAGE" 
                                    : isMarginErrorMin ? 
                                        "BELOW " + currentNetwork.assets[asset].minPosition + " MIN POSITION SIZE"
                                    : isBalanceError ? 
                                        "LOW BALANCE"
                                    : isOIError ?
                                        "OPEN INTEREST LIMIT REACHED"
                                    : isTpError ?
                                        "NEGATIVE TAKE PROFIT"
                                    : "OPEN " + (isLong ? "LONG " : "SHORT ")
                                    }</button>
                                ) : (
                                    <button className="buttons" onClick={!isTigUSDNotDai && !isDaiAllowed ? approveDAI : initOpenPosition}>{!isTigUSDNotDai && !isDaiAllowed ?  "APPROVE" : "OPEN " + (isLong ? "LONG " : "SHORT ") }</button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
             <div className="left_mprice_box">
                <div className="select_box" id="select_box2">
                    <div className="dropdownbox">
                        <p>Asset Info</p>
                    </div>
                </div>

                <div className="vault_box">     
                    <div className="ls_value" style={{marginTop: '10px', marginBottom: '10px'}}>
                        <Center><span>OPENING: 0%</span></Center>
                        <Center><span>CLOSING: {(currentNetwork.assets[asset].fee * 100).toString()}%</span></Center>
                        <Center>-</Center>
                        <Center><span>LONG FUNDING FEE: <span style={{color: longColor}}>{longAPRHourly.toFixed(5)}% PER HOUR</span></span></Center>
                        <Center><span>SHORT FUNDING FEE: <span style={{color: shortColor}}>{shortAPRHourly.toFixed(5)}% PER HOUR</span></span></Center>
                        <Center>-</Center>
                        <Center><span>LONG OPEN INTEREST: <b>{numberToLetters(parseInt((longOi/1e18).toFixed(1)))}</b>/{maxOi > 0 ? numberToLetters(parseInt((maxOi/1e18).toFixed(1))) : "Unlimited"}</span></Center>
                        <Center><span>SHORT OPEN INTEREST: <b>{numberToLetters(parseInt((shortOi/1e18).toFixed(1)))}</b>/{maxOi > 0 ? numberToLetters(parseInt((maxOi/1e18).toFixed(1))) : "Unlimited"}</span></Center>
                    </div>
                </div>
            </div>
        </div>
       
    );
  }
