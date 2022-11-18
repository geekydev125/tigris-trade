import { useEthers } from "@usedapp/core";

type Props = {
    handleOpenModal: any;
}

export default function ConnectButton({ handleOpenModal }: Props) {
  const {activateBrowserWallet, account } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <div className="button_box">
        <a className="primary_button" onClick={handleOpenModal}>{account.slice(0,5)}...{account.slice(-4)}</a>
    </div>
  ) : (
    <div className="button_box">
        <a className="primary_button" onClick={handleConnectWallet}>Connect</a>
    </div>
  );
}