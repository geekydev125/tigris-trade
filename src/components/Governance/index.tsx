import { useEffect, useState, useCallback } from 'react';
import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Center } from '@chakra-ui/react';
import { useAccount } from 'wagmi'

declare var window: any
const { ethereum } = window;

export default function Governance(Props:any) {

    let currentNetwork = Props.currentNetwork;
    const { address } = useAccount();

    useEffect(() => {
        setBridgeSrc(0);
        if (currentNetwork.network_id == bridgeDict[bridgeDst].chainId) {
            setBridgeError(true);
        } else {
            setBridgeError(false);
        }
        setSelectedNfts(Array());
    }, [currentNetwork, address]);

    const [number, setNumber] = useState(1);
    const [available, setAvailable] = useState(0);
    const [treasuryBalance, setTreasuryBalance] = useState(0);
    const [govSupply, setGovSupply] = useState(0);
    const [pending, setPending] = useState(0);
    const [volume, setVolume] = useState(0);
    const [isDaiAllowed, setIsDaiAllowed] = useState(false);
    const [isMaxBridgeError, setIsMaxBridgeError] = useState(false);

    const [ownedNfts, setOwnedNfts] = useState(Array());
    const [selectedNfts, setSelectedNfts] = useState(Array());

    const [isMenuSrc, setIsMenuSrc] = useState(false);
    const [isMenuDst, setIsMenuDst] = useState(false);
    const [bridgeSrc, setBridgeSrc] = useState(0);
    const [bridgeDst, setBridgeDst] = useState(2);
    const [isBridgeError, setBridgeError] = useState(false);
    const bridgeDict = [
        {
            name: currentNetwork.name,
            image: currentNetwork.icon,
            nft: (currentNetwork.addresses.govnft).substring(2),
            chainId: currentNetwork.network_id,
            layerzero: currentNetwork.layerzero,
        },
        {
            name: "Polygon",
            image: "assets/images/polygon.png",
            nft: "5DF98AA475D8815df7cd4fC4549B5c150e8505Be",
            chainId: 137,
            layerzero: 109,
        },
        {
            name: "Arbitrum",
            image: "assets/images/arb.png",
            nft: "303c470c0e0342a1CCDd70b0a17a14b599FF1474",
            chainId: 42161,
            layerzero: 110
        }
    ]

    const networks = [
        {
            rpc: "https://goerli-rollup.arbitrum.io/rpc/",
            name: "Arbitrum Görli",
            network_id: 421613,
            nativeTokenName: "ETH",
            nativeTokenSymbol: "ETH",
            explorer: "https://goerli-rollup-explorer.arbitrum.io"
        },
        {
            rpc: "https://polygon-rpc.com",
            name: "Polygon",
            network_id: 137,
            nativeTokenName: "Matic",
            nativeTokenSymbol: "MATIC",
            explorer: "https://polygonscan.com"
        },
        {
            rpc: "https://arb1.arbitrum.io/rpc",
            name: "Arbitrum",
            network_id: 42161,
            nativeTokenName: "ETH",
            nativeTokenSymbol: "ETH",
            explorer: "https://arbiscan.io"
        }
    ];

    async function checkConnectedChain(src: number) {
        if (currentNetwork.netword_id != bridgeDict[src].chainId && currentNetwork.netword_id != 421613) {
            const cNetwork = networks[src];
            const web3 = new Web3(new Web3.providers.HttpProvider(cNetwork.rpc));
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ 
                        chainId: web3.utils.toHex(cNetwork.network_id),
                        chainName: cNetwork.name,
                        nativeCurrency: {
                            name: cNetwork.nativeTokenName,
                            symbol: cNetwork.nativeTokenSymbol,
                            decimals: 18
                        },
                        rpcUrls: [cNetwork.rpc],
                        blockExplorerUrls: [cNetwork.explorer]
                    }],
                });                
            } catch {
                console.log("No wallet");
                return;
            }
        }
        setBridgeSrc(src);
        if (currentNetwork.network_id === bridgeDict[bridgeDst].chainId) {
            setBridgeError(true);
        } else {
            setBridgeError(false);
        }
    }

    async function checkBridgeDst(dst: number) {
        setBridgeDst(dst);
        if (currentNetwork.network_id === bridgeDict[dst].chainId) {
            setBridgeError(true);
        } else {
            setBridgeError(false);
        }
    }

    useEffect(() => {
        getVolume();
    }, []);

    function getVolume() {
        fetch('https://tigristrade.info/stats/volume')
        .then(response => {

            response.json().then(data => {

                setVolume(data.volume);
            });
        });
    }

    function handleNumberChange(event:any) {
        let v:any = event.target.value;
        v == '' ? (v = 0) : (v = parseInt(v));
        console.log(v);
        console.log("Available: " + available);
        setNumber(v);
        console.log("Number: " + number);
    }

    async function getDAIAllowance() {
        if(ethereum === undefined || !currentNetwork || currentNetwork.network_id === 0 || address === undefined) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);

        let allowance = await daiContract.methods.allowance(address, currentNetwork.addresses.nftsale).call();
        if(allowance != 0) setIsDaiAllowed(true);
    }

    async function getInfo() {
        if(ethereum === undefined || !currentNetwork || currentNetwork.network_id === 0 || address === undefined) return;

        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const nftsaleContract = new web3.eth.Contract(currentNetwork.abis.nftsale as AbiItem[], currentNetwork.addresses.nftsale);
        const daiContract = new web3.eth.Contract(currentNetwork.abis.erc20 as AbiItem[], currentNetwork.marginAssets[0].address);
        const govContract = new web3.eth.Contract(currentNetwork.abis.govnft as AbiItem[], currentNetwork.addresses.govnft);

        if (currentNetwork.network_id != 137 ) {
            setOwnedNfts(await govContract.methods.balanceIds(address).call());
        } else {
            fetch('https://tigristrade.info/stats/user_nfts/'+address)
            .then(response => {
                response.json().then(data => {
                    let ownedNFTs = [];

                    for(let i=0; i<data.nfts.length; i++) ownedNFTs.push(data.nfts[i].id);
                    setOwnedNfts(ownedNFTs);
                });
            });
        }

        let tBalance = await daiContract.methods.balanceOf(currentNetwork.addresses.treasury).call();
        setTreasuryBalance(tBalance/10**currentNetwork.marginAssets[0].decimals);

        let av = await nftsaleContract.methods.available().call();
        setAvailable(av);

        let supply = await govContract.methods.totalSupply().call();
        let contractBalance = await govContract.methods.balanceOf(currentNetwork.addresses.nftsale).call();
        setGovSupply(supply-contractBalance);

        let p = await govContract.methods.pending(address, currentNetwork.addresses.tigusd).call();
        console.log(p);
        setPending(p);
    }

    async function approveDAI() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const daiContract = new ethers.Contract(currentNetwork.marginAssets[0].address, currentNetwork.abis.erc20, signer); 

        let tx = await daiContract.approve(currentNetwork.addresses.nftsale, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        await tx.wait();
        getDAIAllowance();
    }

    async function buy() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftsaleContract = new ethers.Contract(currentNetwork.addresses.nftsale, currentNetwork.abis.nftsale, signer); 

        let tx = await nftsaleContract.buy(number);
        await tx.wait();
        
        getInfo();
    }

    async function claim() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const govnftContract = new ethers.Contract(currentNetwork.addresses.govnft, currentNetwork.abis.govnft, signer); 

        let tx = await govnftContract.claim(currentNetwork.addresses.tigusd);
        await tx.wait();
        
        getInfo();
    }

    async function handleCheckbox(event:any) {
        let id:number = event.target.id;
        let checked:boolean = event.target.checked;

        if (checked) {
            selectedNfts.push(id);
        } else {
            const index = selectedNfts.indexOf(id);
            if (index > -1) {
                selectedNfts.splice(index, 1);
            }
        }
        console.log("Selected: " + selectedNfts);
        if (selectedNfts.length > 25) {
            setIsMaxBridgeError(true);
        } else {
            setIsMaxBridgeError(false);
        }
    }

    async function bridge() {
        if(ethereum == undefined || !currentNetwork || currentNetwork.network_id === 0 || address === undefined) return;
        const web3 = new Web3(new Web3.providers.HttpProvider(currentNetwork.rpc));
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const govContract = new ethers.Contract(currentNetwork.addresses.govnft, currentNetwork.abis.govnft, signer);
        const govContractRead = new web3.eth.Contract(currentNetwork.abis.govnft as AbiItem[], currentNetwork.addresses.govnft);
        console.log("Bridging");
        let destinationData = ("0x" + bridgeDict[bridgeDst].nft + bridgeDict[bridgeSrc].nft);
        console.log(destinationData);
        let estimatePayload = ethers.utils.defaultAbiCoder.encode(["address", "uint[]"], [address, selectedNfts]);
        let estimateAdapter;
        currentNetwork.network_id == 137 ? (
            estimateAdapter = ethers.utils.solidityPack(["uint16", "uint256"], [1, 7000000])
        ) : (
            estimateAdapter = ethers.utils.solidityPack(["uint16", "uint256"], [1, (500000+200000*selectedNfts.length)])
        );
        let estimateValue = (await govContractRead.methods.estimateFees(
            bridgeDict[bridgeDst].layerzero,
            currentNetwork.addresses.govnft,
            estimatePayload,
            false,
            estimateAdapter
        ).call()).nativeFee;
        console.log(estimateValue);
        let tx = await govContract.crossChain(bridgeDict[bridgeDst].layerzero, destinationData, address, selectedNfts, {value: estimateValue});
        await tx.wait();
        setSelectedNfts(Array());
        // Reset nft list
        const oldBridgeSrc = bridgeDst;
        if (oldBridgeSrc > 0) {
            setBridgeSrc(oldBridgeSrc-1);
        } else {
            setBridgeSrc(oldBridgeSrc+1);
        }
        getInfo();
        setBridgeSrc(0);
    }

    useEffect(() => {
        currentNetwork = Props.currentNetwork;
        getInfo();
        getDAIAllowance();
    }, [Props.currentNetwork, address]);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>${volume.toFixed(2)}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>24hr Trading Volume</h6></Center>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <Center><h2>{govSupply}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>NFT Circulating Supply</h6></Center>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{padding: '30px', minWidth: '400px'}}>
                        <Center><h2>${treasuryBalance}</h2></Center>
                        <Center><h6 style={{marginTop: '10px'}}>Treasury Balance</h6></Center>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-8'>
                    <div className="price_wave_area" style={{padding: '30px'}}>
                        <div className='row'>
                            <Center><img src={"assets/images/tigris.svg"} style={{width: '50px', marginBottom: '40px', marginRight: '10px'}}/><h1 style={{marginBottom: '40px'}}>Governance NFT Sale</h1></Center>
                            <div className="ls_value" style={{marginTop: '10px'}}>
                                100% of revenue is distributed to Governance NFTs holders.<br></br>
                                NFTs will be minted and sold in batches only when the project needs funding.<br></br>
                                Max Supply: 10,000<br></br>
                                Network: Arbitrum<br></br>
                                NFT Price: 650 USDT<br></br>
                                
                                Available NFTs: <b>{available}</b>/200<br></br>
                            </div>
                        </div>
                        <div className='row' style={{marginTop: '20px'}}>
                            <div className='col-md-4'></div>
                            <div className='col-md-4'>
                                <div className="ls_sub_title">
                                    <p style={{fontSize: '19px'}}><b>Number</b></p>
                                    <div className="value" style={{minWidth: '60%'}}>
                                        <input type="number" defaultValue={1} onChange={handleNumberChange} style={{minWidth: '100%'}}/>
                                    </div>
                                </div>
                                <Center><p style={{fontSize: '14px', marginTop: '5px', color: '#b8b8b9'}}>Total Price: {650*number} USDT</p></Center>
                            </div>
                            <div className='col-md-4'></div>
                        </div>
                        <div className="vault_button" style={{marginTop: '20px'}}>
                            <button className="buttons" key={isDaiAllowed.toString()} onClick={() => {(!isDaiAllowed) ? approveDAI() : buy()}} style={{background: available < 1 && (isDaiAllowed || currentNetwork.network_id == 0) ? 'grey' : ''}}>
                                {currentNetwork.name != "Unsupported" ? (!isDaiAllowed) ? "Approve" : number > 0 && number <= available ? "Purchase" : available < 1 ? "SOLD OUT!" : "Wrong Number" : "Unsupported Network"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="price_wave_area" style={{paddingTop: '30px', minWidth: '400px'}}>
                        <Center><h2>{(pending/1e18).toFixed(2)} tigUSD</h2></Center>
                        <Center><h6 style={{marginTop: '10px', marginBottom: '10px'}}>Fee Distribution</h6></Center>
                        <button className="buttons" onClick={claim}>
                                Claim
                        </button>
                    </div>
                    <div className="price_wave_area" style={{paddingTop: '30px', minWidth: '400px', paddingBottom: '10px'}} key={bridgeSrc}>
                        <Center><h1 style={{marginBottom: '20px'}}>Bridge</h1></Center>
                        <Center><div style={{marginTop: '5px'}}>From</div></Center>
                        <Center>
                            <div className="select_box" id="select_box3" style={{marginTop: '5px'}}>
                                <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '100px'}} onClick={() => {setIsMenuSrc(!isMenuSrc); setIsMenuDst(false);}}>
                                    <img src={bridgeDict[bridgeSrc].image} alt="" />
                                    <p>{bridgeDict[bridgeSrc].name}</p>
                                </div>
                                <ul className={isMenuSrc ? "dropdown_select showMenu" : "dropdown_select"}>
                                    <li onClick={() => {
                                            setIsMenuSrc(false);
                                            setIsMenuDst(false);
                                            checkConnectedChain(1);
                                        }}>
                                        <img src={bridgeDict[1].image} alt="" className="image"/>
                                        <p>{bridgeDict[1].name}</p>
                                    </li>
                                    <li onClick={() => {
                                            setIsMenuSrc(false);
                                            setIsMenuDst(false);
                                            checkConnectedChain(2);
                                        }}>
                                        <img src={bridgeDict[2].image} alt="" className="image"/>
                                        <p>{bridgeDict[2].name}</p>
                                    </li>
                                </ul>
                            </div>
                        </Center>
                        <Center><div style={{marginTop: '10px'}}>To</div></Center>
                        <Center>
                            <div className="select_box" id="select_box3" style={{marginTop: '5px'}}>
                                <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '100px'}} onClick={() => {setIsMenuDst(!isMenuDst); setIsMenuSrc(false);}}>
                                    <img src={bridgeDict[bridgeDst].image} alt="" />
                                    <p>{bridgeDict[bridgeDst].name}</p>
                                </div>
                                <ul className={isMenuDst ? "dropdown_select showMenu" : "dropdown_select"}>
                                    <li onClick={() => {
                                            checkBridgeDst(1);
                                            setIsMenuDst(false);
                                            setIsMenuSrc(false);
                                        }}>
                                        <img src={bridgeDict[1].image} alt="" className="image"/>
                                        <p>{bridgeDict[1].name}</p>
                                    </li>
                                    <li onClick={() => {
                                            checkBridgeDst(2);
                                            setIsMenuDst(false);
                                            setIsMenuSrc(false);
                                        }}>
                                        <img src={bridgeDict[2].image} alt="" className="image"/>
                                        <p>{bridgeDict[2].name}</p>
                                    </li>
                                </ul>
                            </div>
                        </Center>
                        <Center>
                            <div className="price_wave_area" id="checkboxes">
                                <Center>
                                    <ul>
                                        {
                                            (ownedNfts).map((id:number) => (
                                                <li key={id} style={{fontSize: "16px"}}><input type="checkbox" onChange={handleCheckbox} id={id.toString()}/> {"NFT ID #" + id}</li>
                                            ))
                                        }
                                    </ul>
                                </Center>
                            </div>
                        </Center>
                        {
                            isBridgeError ? (
                                <button className="buttons" style={{background: 'grey'}} disabled>
                                        Can't bridge to the same network
                                </button>                            
                            ) : (
                            currentNetwork.network_id == 0 || currentNetwork.network_id == 421613 ?
                                (
                                    <button className="buttons" style={{background: 'grey'}} disabled>
                                        Unsupported Network
                                    </button>           
                                ) : (
                                    selectedNfts.length == 0 ? (
                                        <button className="buttons" style={{background: 'grey'}} disabled>
                                            Bridge
                                        </button>
                                    ) : (
                                        isMaxBridgeError ? (
                                            <button className="buttons" style={{background: 'grey'}} disabled>
                                                Max 25 NFTs
                                            </button>
                                        ) : (
                                            <button className="buttons" onClick={bridge}>
                                                Bridge
                                            </button>
                                        )
                                    )
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
  }
