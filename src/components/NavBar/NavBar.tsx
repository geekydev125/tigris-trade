import { Nav, Navbar } from "react-bootstrap";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { CustomConnectButton } from "./components/CustomConnectButton";


function openDocs() {
    var win = window.open("https://docs.tigris.trade/", '_blank');
}

function openDiscord() {
    var win = window.open("https://discord.com/invite/tigris/", '_blank');
}

function openOld() {
    var win = window.open("https://tigristrade.eth.limo/", '_blank');
}



export default function Layout(Props: any) {
    const my_url = "127.0.0.1:3000";
    const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + my_url;

    const { address } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const walletConnect = () => {
        const dappUrl = window.location.href.split("//")[1].split("/")[0];
        const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
        window.open(metamaskAppDeepLink, "_self");
        connect();
    }
 
    return (
        <Navbar expand="lg" className="header_area navbar-dark">
            <Navbar.Brand className="logo" style={{ paddingLeft: '42px', paddingTop: '0px', paddingBottom: '0px' }}>
                <a style={{ cursor: 'pointer', width: '180px', maxWidth: '180px' }}><img src="assets/images/logo.png" alt="logo" /></a>

                <button className="bar"><i className="fa fa-bars" aria-hidden="true"></i></button>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto m-menu">
                    <Nav.Link href="#" onClick={() => Props.handlePages(0)}>Trade</Nav.Link>
                    {Props.currentNetwork.network_id != 421613 ? (
                        <>
                            <Nav.Link href="#" onClick={() => Props.handlePages(6)}>Leaderboard</Nav.Link>
                            <Nav.Link href="#" onClick={() => Props.handlePages(3)}>Vault</Nav.Link>
                            <Nav.Link href="#" onClick={() => Props.handlePages(4)}>Governance</Nav.Link>
                            <Nav.Link href="#" onClick={() => Props.handlePages(5)}>Referral</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link href="#" onClick={() => Props.handlePages(2)}>Testnet Faucet</Nav.Link>
                        </>
                    )}
                    <Nav.Link href="#" onClick={() => Props.handlePages(0)}>Documentation</Nav.Link>
                    <Nav.Link href="#" onClick={() => Props.handlePages(0)}>Discord</Nav.Link>
                    <Nav.Link href="#" onClick={() => Props.handlePages(0)}>Old Version</Nav.Link>
                </Nav>
                <Nav className="me-auto menu">
                    <ul>
                        <li><a className={Props.activePage == 0 ? "active" : ""} href="#" onClick={() => Props.handlePages(0)}>Trade</a></li>
                        {Props.currentNetwork.network_id != 421613 ? (
                            <>
                                <li><a className={Props.activePage == 6 ? "active" : ""} href="#" onClick={() => Props.handlePages(6)}>Leaderboard</a></li>
                                <li><a className={Props.activePage == 3 ? "active" : ""} href="#" onClick={() => Props.handlePages(3)}>Vault</a></li>
                                <li><a className={Props.activePage == 4 ? "active" : ""} href="#" onClick={() => Props.handlePages(4)}>Governance</a></li>
                                <li><a className={Props.activePage == 5 ? "active" : ""} href="#" onClick={() => Props.handlePages(5)}>Referral</a></li>
                            </>
                        ) : (
                            <>
                                <li><a className={Props.activePage == 2 ? "active" : ""} href="#" onClick={() => Props.handlePages(2)}>Testnet Faucet</a></li>
                            </>
                        )}
                        <li><a href="#" onClick={openDocs}>Documentation</a></li>
                        <li><a href="#" onClick={openDiscord}>Discord</a></li>
                        <li><a href="#" onClick={openOld}>Old Version</a></li>
                    </ul>
                </Nav>
                <div className="con_sel_button">
                    <ConnectButton />
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}
