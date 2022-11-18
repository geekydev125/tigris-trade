import { ChakraProvider } from "@chakra-ui/react";
import {SocketContext, socket} from './context/socket';
import Container from "./components/Layout/Container";
import CustomCol1 from "./components/Layout/CustomCol1";
import CustomCol2 from "./components/Layout/CustomCol2";
import CustomCol3 from "./components/Layout/CustomCol3";
import NavBar from "./components/NavBar/NavBar"
import AssetSelect from "./components/AssetSelect/AssetSelect";
import TradingChart from "./components/TradingChart/TradingChart";
import TradingPanel from "./components/TradingPanel/TradingPanel";
import SwapComponent from "./components/SwapComponent/SwapComponent";
import ConversationComponent from "./components/ConversationComponent/ConversationComponent";
import Positions from "./components/Positions/Positions";
import DailyStats from "./components/DailyStats/DailyStats";
import Leaderboard from "./components/Leaderboard/Leaderboard"
import { useCallback, useEffect, useState } from "react";
import NotificationToast from "./components/NotificationToast/NotificationToast";
import TestnetFaucet from "./components/TestnetFaucet/TestnetFaucet";
import { getNetwork } from "./constants/networks"
import Vault from "./components/Vault";
import Governance from "./components/Governance";
import { useCookies } from "react-cookie";
import queryString from "query-string";
import Referral from "./components/Referral";
import { ethers } from 'ethers';
import CompetitionLeaderboard from "./components/CompetitionLeaderboard";
import { useNetwork } from "wagmi";

declare var window: any
const { ethereum } = window;

function App() {

  const [page, setPage] = useState(0);
	const [cAsset, setAsset] = useState(0);
	const [prices, setPrices] = useState([]);
	const [oldPrices, setOldPrices] = useState([]);
	const [pendingChartLine, setPendingChartLine] = useState(0);
	const [currentNetwork, setCurrentNetwork] = useState(getNetwork(0));
    const [cookies, setCookie, removeCookie] = useCookies(['ref']);

	const { chain } = useNetwork();


	useEffect(() => {
		const urlRef = queryString.parse(window.location.search).ref;
		if(!cookies.ref && urlRef) setCookie("ref", urlRef);
	}, []);

	useEffect(() => {
		setCurrentNetwork(getNetwork(chain?.id))
	}, [chain?.id]);

	function changePage(id:any) {
		setPage(id);
	}

	const handlePrices = useCallback((p:any) => {
        setPrices(p.prices as any);
        setOldPrices(p.oldPrices as any);
    }, []);

	useEffect(() => {
		if(isNaN(prices[0])) return;

		let dec = currentNetwork.assets[cAsset].decimals;
		let pair = currentNetwork.assets[cAsset].name + " ";

		if(page == 0) document.title = pair + "$"+ parseFloat(prices[cAsset]).toFixed(dec) +" | Tigris";
		// if(page == 1) document.title = "Leaderboard | Tigris";
		if(page == 2) document.title = "Testnet Faucet | Tigris";
		if(page == 3) document.title = "Vault | Tigris";
		if(page == 4) document.title = "Governance | Tigris";
		if(page == 5) document.title = "Referral | Tigris";
		if(page == 6) document.title = "Leaderboard | Tigris";
	}, [prices, page]);

	useEffect( ()=> {
		socket.on("Prices", handlePrices); 
	}, []);

	const handleAssetChange = (asset:any) => {
        setAsset(asset);
    }
	
	const [toasts, setToasts] = useState([{id: 0, text: "First"}]);

	async function addToast(text:any) {
		var id = toasts.length;
		var t = [{id: id, text: text}];
		setToasts(toasts.concat(t));
		return id;
  	}

	async function removeToast(i:any) {
		var newToasts = [...toasts];
		newToasts.splice(idToIndex(i), 1);
		setToasts(newToasts);
	}

	async function editToast(i:any, newText:any) {
		removeToast(i);
		return await addToast(newText);
	}

	function idToIndex(id:any) {
		for(var i=0; i<toasts.length; i++) {
			if(toasts[i].id == id) return i;
		}
		return -1;
	}

  return (
    <SocketContext.Provider value={socket}>
			<ChakraProvider>
				<NavBar handlePages={changePage} activePage={page} currentNetwork={currentNetwork} />
				{page == 0 ? (
					<div>
						<NotificationToast allToasts={toasts} removeToast={removeToast} />
						<Container>
							<CustomCol1>
								<AssetSelect handleAssetChange={handleAssetChange} cPrice={prices} oPrice={oldPrices} currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
							</CustomCol1>
							<CustomCol2>
								<TradingChart asset={cAsset} prices={prices} pendingLine={pendingChartLine}/>
								<Positions cPrice={prices} addToast={addToast} editToast={editToast} currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)} setPending={setPendingChartLine} />
								<DailyStats/>
							</CustomCol2>
							<CustomCol3>
								<TradingPanel 
									cPrice={prices[cAsset]} 
									asset={cAsset} 
									setPending={setPendingChartLine} 
									addToast={addToast} 
									editToast={editToast}
									currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
								{/* <SwapComponent currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/> */}
							</CustomCol3>
						</Container>
					</div>
				) : page == 1 ?  (
					<Container>
						<CustomCol1/>
						<CustomCol2>
							<Leaderboard currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
						</CustomCol2>
						<CustomCol1/>
					</Container>
				) : page == 3 ? (
					<Container>
						<CustomCol1/>
						<CustomCol2>
							<Vault currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
						</CustomCol2>
						<CustomCol1/>
					</Container>
				) : page == 4 ? (
					<Container>
						<CustomCol1/>
						<CustomCol2>
							<Governance currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
						</CustomCol2>
						<CustomCol1/>
					</Container>
				) : page == 5 ? (
					<Container>
						<CustomCol1/>
						<CustomCol2>
							<Referral currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
						</CustomCol2>
						<CustomCol1/>
					</Container>
				) : page == 6 ? (
					<Container>
						<CustomCol1/>
						<CustomCol2>
							<CompetitionLeaderboard currentNetwork={currentNetwork.network_id != 0 ? currentNetwork : getNetwork(0)}/>
						</CustomCol2>
						<CustomCol1/>
					</Container>
				) : (
					<div>
						<NavBar handlePages={changePage} activePage={page} currentNetwork={currentNetwork} />
						<Container>
							<CustomCol1/>
							<CustomCol2>
								<TestnetFaucet/>
							</CustomCol2>
							<CustomCol1/>
						</Container>
					</div>
				)}
			</ChakraProvider>
		</SocketContext.Provider>
  );
}

export default App;
