import { useEffect, useState, useCallback } from 'react';
import { AbiItem } from 'web3-utils'
import Web3 from 'web3';
import Item from './components/Item'

export default function Positions(Props:any) {
    
    const [cUsers, setUsers] = useState(
        [
            {
                user: "",
                balance: 0
            }
        ]
    );

    const [addresses, setAddresses] = useState([{address:""}]);

    useEffect(() => {
        fetch('https://tigris-e5mxb.ondigitalocean.app/stats-bot/contest')
        .then(response => {
            response.json().then(data => {
                data = data.data;
                console.log(data);
                setAddresses(data);
            });
        });
    }, []);

    useEffect(()=>{
        if(addresses[0].address == "" || !Props.currentNetwork || Props.currentNetwork.network_id == 0) return;
		const web3 = new Web3(new Web3.providers.HttpProvider(Props.currentNetwork.rpc));
        var tigusdContract:any = new web3.eth.Contract(Props.currentNetwork.abis.tigusd as AbiItem[], Props.currentNetwork.addresses.tigusd);

		let addressesBalance:any = [];
		for(var i = 0; i < addresses.length; i++) {
			addressesBalance.push(tigusdContract.methods.balanceOf(addresses[i].address).call());
		}

		Promise.all(addressesBalance).then((s) => {
            var data = [];
			for(var i=0; i<s.length; i++) {
                var user = {
                    user: addresses[i].address,
                    balance: s[i]
                }
                data.push(user);
            }

            data.sort(compare);
            setUsers(data);
		}); 

  	}, [addresses])

    function compare(a:any, b:any) {
        if(parseFloat(a.balance) > parseFloat(b.balance)){
            return -1;
        }
        if(parseFloat(a.balance) < parseFloat(b.balance)){
            return 1;
        }
        return 0;
    }

    return (
        <div className="price_wave_table">
            <div className="price_area">
                <div className="nav" id="nav-tab" role="tablist">
                    <button className="active" id="pt_1" data-bs-toggle="tab" data-bs-target="#ptb_1" type="button" role="tab" aria-controls="ptb_1" aria-selected="true">Contest Participants</button>
                </div>

                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="ptb_1" role="tabpanel" aria-labelledby="pt_1">
                    <div className="pwt_box">
                        <div className="pwt_head">
                            <div className="pwt_col_0_leaderboard">
                                <div className="pwt_title"><span>Rank</span></div>
                            </div>
                            <div className="pwt_col_1_leaderboard">
                                <div className="pwt_title"><span>Address</span></div>
                            </div>
                            <div className="pwt_col_2_leaderboard">
                                <div className="pwt_title"><span>Balance</span></div>
                            </div>
                            <div className="pwt_col_3_leaderboard">
                                <div className="pwt_title"><span>Prize</span></div>
                            </div>
                        </div>
                        {
                            (cUsers).map((n:any,index) => ( 
                                <div className="pwt_body">
                                    <div className="pwt_col_0_leaderboard">
                                        <div className="pwt_title">
                                            <p>#{index+1}</p>
                                        </div>
                                    </div>
                                    <div className="pwt_col_1_leaderboard">
                                        <div className="pwt_title_leaderboard">
                                            <h1>{n.user}</h1>
                                        </div>
                                    </div>
                                    <div className="pwt_col_2_leaderboard">
                                        <div className="pwt_title">
                                            <p>{(n.balance/1e18).toFixed(2)} tigUSD</p>
                                        </div>
                                    </div>
                                    <div className="pwt_col_3_leaderboard">
                                        <div className="pwt_title">
                                            <p>{index == 0 ? "1,500 USDC" : index == 1 ? "1,000 USDC" : index == 2 ? "500 USDC" : ""}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }