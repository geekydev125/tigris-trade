import { Box, Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Center } from "@chakra-ui/react";
import { ethers } from 'ethers';
import { rawListeners } from "process";
import { useEffect, useState } from "react";
import { getPrice, checkSigs, getData } from '../../../price_handle/index';

declare var window: any
const { ethereum } = window;

type Props = {
	isOpen: any;
	onClose: any;
	Id:any ;
	sl:any;
	tp:any;
	direction:any;
	openPrice:any;
  margin:any;
	lev:any;
  currentPrice:any;
  asset:any;
  addToast:Function,
  editToast:Function,
  currentNetwork:any,
  pnlValue:any,
  accInterest:any,
  updatePos:any,
  updateAnimation:any,
  isAfterFees:boolean
}

export default function EditPositionModal({ isOpen, onClose, Id, sl, tp, direction, openPrice, margin, lev, currentPrice, asset, addToast, editToast, currentNetwork, pnlValue, accInterest, updatePos, updateAnimation, isAfterFees}: Props) {
    
	function getTradingContract() {
		if(ethereum == undefined || !currentNetwork || currentNetwork.network_id == 0) return undefined;
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, signer); 
	}
	
	var slInputDOM:any = {value: ""};
	var tpInputDOM:any = {value: ""};
  var slSliderDOM:any = {value: ""};
  var tpSliderDOM:any = {value: ""};
	var partialInputDOM:any;
  var modifyMarginDOM:any;
  var addToPositionDOM:any;

	const [slPercent, setSlPercent] = useState(calculatePercent(sl));
	const [isSlError, setIsSlError] = useState(false);
	const [tpPercent, setTpPercent] = useState(calculatePercent(tp));
	const [isTpError, setIsTpError] = useState(false);
	const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isMenuMargin, setIsMenuMargin] = useState(false);
  const [isMenuAddToPosition, setIsMenuAddToPosition] = useState(false);
  const [isAddMargin, setIsAddMargin] = useState(true);
  const [isMenuAddMargin, setIsMenuAddMargin] = useState(false);
	const [isTigUSDNotDaiClosing, setIsTigUSDNotDaiClosing] = useState(true);
  const [isTigUSDNotDaiMargin, setIsTigUSDNotDaiMargin] = useState(true);
  const [isTigUSDNotDaiAddToPosition, setIsTigUSDNotDaiAddToPosition] = useState(true);
  const [addToPositionValue, setAddToPositionValue] = useState("");
  const [modifyMarginValue, setModifyMarginValue] = useState("");

  function handleAddToPositionChange() {
    if (addToPositionDOM != null) {
      setAddToPositionValue(addToPositionDOM.value);
    }
  }

  function handleModifyMarginChange() {
    if (modifyMarginDOM != null) {
      setModifyMarginValue(modifyMarginDOM.value);
    }
  }

  let dec = currentNetwork.assets[asset].decimals;

  function handleSlChange() {
		var slInput = parseFloat(slInputDOM.value);
		if(slInput < 0 || isNaN(slInput)) {
      slInputDOM.value = "";
      slInput = 0;
    }
		if((direction && slInput > currentPrice && slInput > 0) || (!direction && slInput < currentPrice && slInput > 0)) {
			setIsSlError(true);
		} else {
			setIsSlError(false);
		}
		setSlPercent(calculatePercent(slInput));
	}

	function handleTpChange() {
		var tpInput = parseFloat(tpInputDOM.value);
    console.log(tpInput);
		if(tpInput < 0 || isNaN(tpInput)) {
      tpInputDOM.value = "";
      tpInput = 0;
    }
		if((direction && tpInput < currentPrice && tpInput > 0) || (!direction && tpInput > currentPrice && tpInput > 0)) {
			setIsTpError(true);
		} else {
			setIsTpError(false);
		}
		setTpPercent(calculatePercent(tpInput));
	}

  function handleTpPercentChange() {
    var percent = parseFloat(tpSliderDOM.value);
		setTpPercent(percent);
    var tpInput = direction ? (openPrice + (openPrice*percent/100)/lev).toFixed(dec) : (openPrice - (openPrice*percent/100)/lev).toFixed(dec);
    tpInputDOM.value = tpInput.toString();
		if((direction && tpInput < currentPrice && tpInput > 0) || (!direction && tpInput > currentPrice && tpInput > 0)) {
			setIsTpError(true);
		} else {
			setIsTpError(false);
		}
	}

  function handleSlPercentChange() {
    var percent = parseFloat(slSliderDOM.value);
    var slInput = direction ? (openPrice - (openPrice*percent/100)/lev).toFixed(dec) : (openPrice + (openPrice*percent/100)/lev).toFixed(dec);
    direction ? (slInput <= openPrice ? setSlPercent(-percent) : setSlPercent(+percent)) : (slInput >= openPrice ? setSlPercent(-percent) : setSlPercent(+percent))
    slInputDOM.value = slInput.toString();
		if((direction && slInput > currentPrice && slInput > 0) || (!direction && slInput < currentPrice && slInput > 0)) {
			setIsSlError(true);
		} else {
			setIsSlError(false);
		}
	}
  
	async function initUpdateSl() {
		if(isSlError) return;

    var slInput;
    if (slInputDOM.value == "") {
      slInput = 0;
    } else {
      slInput = ethers.utils.parseEther(slInputDOM.value);
    }

		var toastId = await addToast("Getting live prices...");

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

		toastId = await editToast(toastId, "Please confirm the transaction within 10 seconds.");

		try {
      var tradingContractSend = getTradingContract();
      if (tradingContractSend == undefined) {
        throw "No trading contract available";
      }
      let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
      let tx = await tradingContractSend.updateTpSl(false, Id, slInput, priceData, allSigs, {gasPrice: (gasPriceEstimate), gasLimit: currentNetwork.gasLimit});
      onClose();
      toastId = await editToast(toastId, "Confirming transaction...");
      await tx.wait();
      updateAnimation();
      updatePos();
      editToast(toastId, "Stop loss is updated.");
      console.log(`Mined, hash: ${tx.hash}`);
		} catch(e:any) {
      if (e.reason == null) {
        editToast(toastId, "Transaction was cancelled");
      } else {
        editToast(toastId, "Error: " + e.reason);
      }
		}
	}

	async function initUpdateTp() {
		if(isTpError) return;

    var tpInput;
    if (tpInputDOM.value == "") {
      tpInput = 0;
    } else {
      tpInput = ethers.utils.parseEther(tpInputDOM.value);
    }

    var toastId = await addToast("Please confirm the transaction.");

    var fSigs:any = await getData(asset);

    console.log("x", fSigs);
    if(!fSigs) {
        var price = await getPrice(asset);
        fSigs = await checkSigs(price);
    }

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
		
		try {
      var tradingContractSend = getTradingContract();
      if (tradingContractSend == undefined) {
        throw "No trading contract available";
      }
      let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
      let tx = await tradingContractSend.updateTpSl(true, Id, tpInput, priceData, allSigs, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
      onClose();
      toastId = await editToast(toastId, "Confirming transaction...");
      await tx.wait();
      updateAnimation();
      updatePos();
      editToast(toastId, "Take profit is updated.");
      console.log(`Mined, hash: ${tx.hash}`);
		} catch(e:any) {
      if (e.reason == null) {
        editToast(toastId, "Transaction was cancelled");
      } else {
        editToast(toastId, "Error: " + e.reason);
      }
		}
	}

	async function initPartialClose() {
		console.log(Id);

		var partialInput = parseInt((parseFloat(partialInputDOM.value) * 1e8).toString());

		initClose(partialInput, isTigUSDNotDaiClosing ? currentNetwork.addresses.tigusd : currentNetwork.marginAssets[0].address);
	}

	async function initClose(partialInput:any, token:any) {

		var toastId = await addToast("Getting live prices...");

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

		toastId = await editToast(toastId, "Please confirm the transaction within 10 seconds.");
		
		try {
      var tradingContractSend = getTradingContract();
      if (tradingContractSend == undefined) {
        throw "No trading contract available";
      }
      let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
			let tx = await tradingContractSend?.initiateCloseOrder(Id, partialInput, priceData, allSigs, currentNetwork.addresses.tigusdvault, token, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
      onClose();
			toastId = await editToast(toastId, "Order sent with price $"+ parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(2));
      await tx.wait();
      updateAnimation();
      updatePos();
      editToast(toastId, partialInput/1e8 + "% of position closed with price $"+ parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(2));
			console.log(`Mined, hash: ${tx.hash}`);
		} catch(e:any) {
      if (e.reason == null) {
          editToast(toastId, "Transaction was cancelled");
      } else {
          editToast(toastId, "Error: " + e.reason);
      }
		} 
	}

  async function initAddMargin() {
    console.log(Id);

    var marginInput = ethers.utils.parseEther((modifyMarginDOM.value));
    var marginInputToast = parseFloat(modifyMarginDOM.value).toFixed(2).toString();

    try {
      var token = isTigUSDNotDaiMargin ? currentNetwork.addresses.tigusd : currentNetwork.marginAssets[0].address;
      var tradingContractSend = getTradingContract();
      if (tradingContractSend == undefined) {
        throw "No trading contract available";
      }
      let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);   
			let tx = await tradingContractSend?.addMargin(Id, token, currentNetwork.addresses.tigusdvault, marginInput, [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false], {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
      onClose();
      var toastId = await addToast("Adding $" + marginInputToast + " margin to position " + Id.toString());
      await tx.wait();
      updateAnimation();
      updatePos();
      editToast(toastId, "$" + marginInputToast + " margin added to position " + Id.toString());
			console.log(`Mined, hash: ${tx.hash}`);
		} catch(e:any) {
      if (e.reason == null) {
          editToast(toastId, "Transaction was cancelled");
      } else {
          editToast(toastId, "Error: " + e.reason);
      }
		}
  }

  async function initRemoveMargin() {
    console.log(Id);

		var marginInput = ethers.utils.parseEther(modifyMarginDOM.value);
    var marginInputToast = parseFloat(modifyMarginDOM.value).toFixed(2).toString();

    var token = isTigUSDNotDaiMargin ? currentNetwork.addresses.tigusd : currentNetwork.addresses.dai;

		var toastId = await addToast("Getting live prices...");

    var fSigs:any = await getData(asset);

    console.log("x", fSigs);
    if(!fSigs) {
        var price = await getPrice(asset);
        fSigs = await checkSigs(price);
    }

    let priceData:any = [];
    let allSigs:any = [];
    var closed: boolean = false;

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

		toastId = await editToast(toastId, "Please confirm the transaction within 10 seconds.");

		try {
      var tradingContractSend = getTradingContract();
      if (tradingContractSend == undefined) {
        throw "No trading contract available";
      }
      let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
      let tx = await tradingContractSend?.removeMargin(Id, currentNetwork.addresses.tigusdvault, token, marginInput, priceData, allSigs, {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
      onClose();
      toastId = await editToast(toastId, "Removing $" + marginInputToast + " margin from position " + Id.toString());
      await tx.wait();
      updateAnimation();
      updatePos();
      editToast(toastId, "Removed $" + marginInputToast + " margin from position " + Id.toString());
      console.log(`Mined, hash: ${tx.hash}`);
		} catch(e:any) {
      if (e.reason == null) {
        editToast(toastId, "Transaction was cancelled");
      } else {
        editToast(toastId, "Error: " + e.reason);
      }
		}
  }

  async function initAddToPosition() {
    console.log(Id);

		var marginInput = ethers.utils.parseEther(addToPositionDOM.value);
    var marginInputToast = parseFloat(addToPositionDOM.value).toFixed(2).toString();

    var token = isTigUSDNotDaiAddToPosition ? currentNetwork.addresses.tigusd : currentNetwork.marginAssets[0].address;

		var toastId = await addToast("Getting live prices...");

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

		toastId = await editToast(toastId, "Please confirm the transaction within 10 seconds.");

		try {
      var tradingContractSend = getTradingContract();
      if (tradingContractSend == undefined) {
        throw "No trading contract available";
      }
      let gasPriceEstimate = Math.round((await tradingContractSend.provider.getGasPrice()).toNumber() * 2);
      let tx = await tradingContractSend?.addToPosition(Id, marginInput, priceData, allSigs, currentNetwork.addresses.tigusdvault, token, [0, 0, 0, ethers.constants.HashZero, ethers.constants.HashZero, false], {gasPrice: gasPriceEstimate, gasLimit: currentNetwork.gasLimit});
      onClose();
      toastId = await editToast(toastId, "Opening $" + marginInputToast + " margin position on top of position " + Id.toString() + " at price $" + parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(2));
      await tx.wait();
      updateAnimation();
      updatePos();
      toastId = await editToast(toastId, "Opened $" + marginInputToast + " margin position on top of position " + Id.toString() + " at price $" + parseFloat((parseInt(priceData[0][2])/1e18).toString()).toFixed(2));
      console.log(`Mined, hash: ${tx.hash}`);
		} catch(e:any) {
      if (e.reason == null) {
        editToast(toastId, "Transaction was cancelled");
      } else {
        editToast(toastId, "Error: " + e.reason);
      }
		}
  }

	function calculatePercent(cPrice:any) {
		if(cPrice == 0) return 0;
		if(isNaN(cPrice)) return 0;

		var output = direction ? (cPrice - openPrice)/openPrice*100*lev : (openPrice - cPrice)/openPrice*100*lev;
    if (output == 0) return 0.01;
		return output < -100 ? -100 : output;
	}

	function additionalOnClose() {
		slInputDOM.value = sl;
		tpInputDOM.value = tp;
    	//partialInputDOM.value = 50;
		setSlPercent(calculatePercent(sl));
		setTpPercent(calculatePercent(tp));
		onClose();
	}

    return(
      <Modal isCentered isOpen={isOpen} onClose={additionalOnClose} size="md">
        <ModalOverlay />
        <ModalContent
          background="gray.900"
          border="1px"
          borderStyle="solid"
          borderColor="gray.700"
          borderRadius="md"
        >
          <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
            Edit Position #{Id}
          </ModalHeader>
          <ModalCloseButton
            color="white"
            fontSize="sm"
            _hover={{
              color: "whiteAlpha.700",
            }}
          />
          <ModalBody pt={0} px={4}>
            <Box
              borderRadius="md"
              border="1px"
              borderStyle="solid"
              borderColor="gray.600"
              px={5}
              pt={4}
              pb={2}
              mb={3}
            >
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  {isAfterFees ? "Payout after fees" : "Payout before fees"}
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <Text
                  color="white"
                  fontSize="xl"
                  fontWeight="semibold"
                  ml="2"
                  lineHeight="1.1"
                >
                  ${pnlValue}
                </Text>
              </Flex>

              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Funding Fees
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <Text
                  color="white"
                  fontSize="xl"
                  fontWeight="semibold"
                  ml="2"
                  lineHeight="1.1"
                >
                  {accInterest/1e18 < 0 ? "-$"+parseFloat(""+accInterest/1e18*-1).toFixed(2) : "$"+parseFloat(""+accInterest/1e18).toFixed(2)}
                </Text>
              </Flex>

              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Edit Stop Loss
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <Text
                  color="white"
                  fontSize="xl"
                  fontWeight="semibold"
                  ml="2"
                  lineHeight="1.1"
                >
                  {(slPercent == 0) ? 'None' : (slPercent < 0 ? slPercent.toFixed(1) : '+'+slPercent.toFixed(1))+'%'}
                </Text>
                <div className="value" id="tpsl">
                    <input type="text" placeholder="None" defaultValue={sl != 0 ? sl.toFixed(dec) : openPrice} ref={ref => slInputDOM = ref} onChange={handleSlChange} style={{minWidth: '90px', marginLeft:'5px', marginRight: '5px'}}/>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    borderColor="blue.800"
                    borderRadius="md"
                    color="blue.500"
                    fontSize="13px"
                    fontWeight="normal"
                    px={2}
                    height="26px"
                    _hover={{
                    background: "none",
                    borderColor: "blue.300",
                    textDecoration: "none",
                    }}
					          onClick={initUpdateSl}
                >
                    Edit Stop Loss
                </Button>
              </Flex>
              <Flex>
                <div className="range_slider" style={{width: '100%'}}>
                  <input className="range" type="range" onChange={handleSlPercentChange} ref={ref => slSliderDOM = ref} defaultValue={(-1*slPercent).toString()} min="0" max="90" />
                </div>
              </Flex>
              <Flex justifyContent="center" alignItems="center" mb={3}>
                <Text color="red.400" fontSize="sm">
                    {isSlError ? direction ? 'Price has to be less than current price' : 'Price has to be more than current price' : ''}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Edit Take Profit
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <Text
                  color="white"
                  fontSize="xl"
                  fontWeight="semibold"
                  ml="2"
                  lineHeight="1.1"
                >
                  {(tpPercent == 0) ? 'None' : (tpPercent < 0 ? tpPercent.toFixed(1) : '+'+tpPercent.toFixed(1))+'%'}
                </Text>
                <div className="value" id="tpsl">
                    <input type="text" placeholder="None" defaultValue={tp != 0 ?tp.toFixed(dec) : openPrice} ref={ref => tpInputDOM = ref} onChange={handleTpChange} style={{minWidth: '90px', marginLeft:'5px', marginRight: '5px'}}/>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    borderColor="blue.800"
                    borderRadius="md"
                    color="blue.500"
                    fontSize="13px"
                    fontWeight="normal"
                    px={2}
                    height="26px"
                    _hover={{
                    background: "none",
                    borderColor: "blue.300",
                    textDecoration: "none",
                    }}
					          onClick={initUpdateTp}
                >
                    Edit Take Profit
                </Button>
              </Flex>
              <Flex>
                <div className="range_slider" style={{width: '100%'}}>
                  <input className="range" type="range" onChange={handleTpPercentChange} ref={ref => tpSliderDOM = ref} defaultValue={tpPercent.toString()} min="0" max="900" />
                </div>
              </Flex>
              <Flex justifyContent="center" alignItems="center" mb={3}>
                <Text color="red.400" fontSize="sm">
                    {isTpError ? direction ? 'Price has to be more than current price' : 'Price has to be less than current price' : ''}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Partial Closing
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <div className="select_box" id="select_box3">
                  <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '110px'}} onClick={() => setIsMenuClosing(!isMenuClosing)}>
                    <img src={isTigUSDNotDaiClosing ? "assets/images/tigUSD.svg" : currentNetwork.marginAssets[0].image} alt="" />
                    <p>{isTigUSDNotDaiClosing ? "tigUSD" : currentNetwork.marginAssets[0].name}</p>
                  </div>

                  <ul className={isMenuClosing ? "dropdown_select showMenu" : "dropdown_select"}>
                    <li onClick={() => {setIsTigUSDNotDaiClosing(true); setIsMenuClosing(false)}}>
                      <img src={"assets/images/tigUSD.svg"} alt="" className="image"/>
                      <p>tigUSD</p>
                    </li>
                    <li onClick={() => {setIsTigUSDNotDaiClosing(false); setIsMenuClosing(false)}}>
                      <img src={currentNetwork.marginAssets[0].image} alt="" className="image"/>
                      <p>{currentNetwork.marginAssets[0].name}</p>
                    </li>
                  </ul>
                </div>
                <div className="percentvalue" data-placeholder="%">
                    <input type="number" placeholder="0" defaultValue="100" ref={ref => partialInputDOM = ref} style={{minWidth: '70px', marginLeft:'5px', marginRight: '5px'}} />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    borderColor="blue.800"
                    borderRadius="md"
                    color="blue.500"
                    fontSize="13px"
                    fontWeight="normal"
                    px={2}
                    height="26px"
                    _hover={{
                    background: "none",
                    borderColor: "blue.300",
                    textDecoration: "none",
                    }}
                    onClick={initPartialClose}
                >
                    Close Position
                </Button>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Add/Remove Margin
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <div className="select_box" id="select_box3">

                  <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '110px'}} onClick={() => setIsMenuMargin(!isMenuMargin)}>
                    <img src={isTigUSDNotDaiMargin ? "assets/images/tigUSD.svg" : currentNetwork.marginAssets[0].image} alt="" />
                    <p>{isTigUSDNotDaiMargin ? "tigUSD" : currentNetwork.marginAssets[0].name}</p>
                  </div>
                  <ul className={isMenuMargin ? "dropdown_select showMenu" : "dropdown_select"}>
                    <li onClick={() => {setIsTigUSDNotDaiMargin(true); setIsMenuMargin(false)}}>
                      <img src={"assets/images/tigUSD.svg"} alt="" className="image"/>
                      <p>tigUSD</p>
                    </li>
                    <li onClick={() => {setIsTigUSDNotDaiMargin(false); setIsMenuMargin(false)}}>
                      <img src={currentNetwork.marginAssets[0].image} alt="" className="image"/>
                      <p>{currentNetwork.marginAssets[0].name}</p>
                    </li>
                  </ul>
                  
                </div>

                <div className="select_box" id="select_box3">

                  <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '50px', marginLeft: '5px', marginRight: '5px'}} onClick={() => setIsMenuAddMargin(!isMenuAddMargin)}>
                    <p>{isAddMargin ? "Add" : "Remove"}</p>
                  </div>
                  <ul className={isMenuAddMargin ? "dropdown_select showMenu" : "dropdown_select"}>
                    <li onClick={() => {setIsAddMargin(true); setIsMenuAddMargin(false)}}>
                      <p>Add</p>
                    </li>
                    <li onClick={() => {setIsAddMargin(false); setIsMenuAddMargin(false)}}>
                      <p>Remove</p>
                    </li>
                  </ul>
                  
                </div>
                <div className="value">
                    <input type="number" placeholder="0" ref={ref => modifyMarginDOM = ref} style={{minWidth: '70px', marginRight: '5px'}} onChange={handleModifyMarginChange} />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    borderColor="blue.800"
                    borderRadius="md"
                    color="blue.500"
                    fontSize="13px"
                    fontWeight="normal"
                    minWidth="50px"
                    px={2}
                    height="26px"
                    _hover={{
                    background: "none",
                    borderColor: "blue.300",
                    textDecoration: "none",
                    }}
                    onClick={isAddMargin? initAddMargin : initRemoveMargin}
                >
                    {isAddMargin ? "Add" : "Remove"}
                </Button>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <div style={{color:'gray', fontSize:'13px', marginLeft:'1px'}}>
                    {"New Margin: " + (modifyMarginValue != "" ? (isAddMargin ? (parseFloat(margin) + parseFloat(modifyMarginValue)) : (parseFloat(margin) - parseFloat(modifyMarginValue))).toFixed(2).toString() : parseFloat(margin).toFixed(2).toString())}
                  <p>
                    {"New Leverage: " + (modifyMarginValue != "" ? (isAddMargin ? ((parseFloat(margin)*parseFloat(lev)/(parseFloat(margin)+parseFloat(modifyMarginValue)))).toFixed(2).toString() : ((parseFloat(margin)*parseFloat(lev)/(parseFloat(margin)-parseFloat(modifyMarginValue)))).toFixed(2).toString()) : parseFloat(lev).toFixed(2).toString())}
                  </p>
                </div>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Add to position
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mt={2} mb={4} lineHeight={1}>
                <div className="select_box" id="select_box3">
                  <div className="dropdownbox" style={{border: '1px solid #4a5568', minWidth: '110px'}} onClick={() => setIsMenuAddToPosition(!isMenuAddToPosition)}>
                    <img src={isTigUSDNotDaiAddToPosition ? "assets/images/tigUSD.svg" : currentNetwork.marginAssets[0].image} alt="" />
                    <p>{isTigUSDNotDaiAddToPosition ? "tigUSD" : currentNetwork.marginAssets[0].name}</p>
                  </div>

                  <ul className={isMenuAddToPosition ? "dropdown_select showMenu" : "dropdown_select"}>
                    <li onClick={() => {setIsTigUSDNotDaiAddToPosition(true); setIsMenuAddToPosition(false)}}>
                      <img src={"assets/images/tigUSD.svg"} alt="" className="image"/>
                      <p>tigUSD</p>
                    </li>
                    <li onClick={() => {setIsTigUSDNotDaiAddToPosition(false); setIsMenuAddToPosition(false)}}>
                      <img src={currentNetwork.marginAssets[0].image} alt="" className="image"/>
                      <p>{currentNetwork.marginAssets[0].name}</p>
                    </li>
                  </ul>
                </div>
                <div className="value">
                    <input type="number" placeholder="0" ref={ref => addToPositionDOM = ref} style={{minWidth: '100px'}} onChange={handleAddToPositionChange} />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    borderColor="blue.800"
                    borderRadius="md"
                    color="blue.500"
                    fontSize="13px"
                    fontWeight="normal"
                    px={2}
                    height="26px"
                    _hover={{
                    background: "none",
                    borderColor: "blue.300",
                    textDecoration: "none",
                    }}
                    onClick={initAddToPosition}
                >
                    Open
                </Button>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <div style={{color:'gray', fontSize:'13px', marginLeft:'1px'}}>
                    {"New Margin: $" + (addToPositionValue != "" ? (parseFloat(addToPositionValue.toString()) + parseFloat(margin)).toFixed(2).toString() : parseFloat(margin).toFixed(2).toString())}
                  <p>
                    {"New Position Size: $" + (addToPositionValue != "" ? ((parseFloat(addToPositionValue.toString()) + parseFloat(margin)) * parseFloat(lev)).toFixed(2).toString() : (parseFloat(margin)*parseFloat(lev)).toFixed(2).toString())}
                  </p>
                  <p>
                    {"New Open Price: $" + (addToPositionValue != "" ? (parseFloat(openPrice)*parseFloat(margin)/(parseFloat(margin)+parseFloat(addToPositionValue))+parseFloat(currentPrice)*parseFloat(addToPositionValue)/(parseFloat(margin)+parseFloat(addToPositionValue))).toFixed(dec) : openPrice)}
                  </p>
                </div>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
}
