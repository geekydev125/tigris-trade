import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import "./styles.css"

export default function CompetitionLeaderboard(Props: any) {

    const [trigiData, setTrigiData] = useState<any>([]);
    const [isLoading, setLoading] = useState(false);

    const { address } = useAccount();

    useEffect(() => {
        getData();
        console.log("Address: ", address);
    }, [])

    const medalAward = (rank: number) => {
        let medal;
        if (rank === 1) {
            medal = <img src="assets/images/rank-first.png" width="20" height="20" />
        } else if (rank === 2) {
            medal = <img src="assets/images/rank-second.png" width="20" height="20" />
        } else if (rank === 3) {
            medal = <img src="assets/images/rank-third.png" width="20" height="20" />
        } else {
            medal = "#" + rank;
        }

        return medal;
    }

    async function getData() {
        setLoading(true);
        fetch('https://tigristrade.info/stats/leaderboard')
            .then(response => {
                response.json().then(data => {
                    let obj = data['leaderboard'];
                    let temp = Object.keys(obj);
                    let newObj: any = [];
                    for (let i = 0; i < temp.length; i++) {
                        let flag = 0;
                        if(address === temp[i]) flag = 1;                       
                        newObj[i] = { addy: temp[i].slice(0, 6), count: obj[temp[i]].count, win_rate: ((obj[temp[i]].win_rate * 100).toFixed(2)), pnl: obj[temp[i]].pnl.toFixed(2), flag:flag };
                    }
                    setTrigiData(newObj);
                    newObj.sort(compare);
                    setLoading(false);
                });
            });
    }

    function compare(a: any, b: any) {
        if (parseFloat(a.pnl) > parseFloat(b.pnl)) {
            return -1;
        }
        if (parseFloat(a.pnl) < parseFloat(b.pnl)) {
            return 1;
        }
        return 0;
    }

    return (
        <div className="leader_table">
            <div className="leader_table_container">
                <div className="leader_table_header">
                    <h1>Competition Leaderboard</h1>
                </div>
                <div className="price_wave_table">
                    <div className="price_area">
                    { isLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : 
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="ptb_1" role="tabpanel" aria-labelledby="pt_1">
                                <div className="leader_pwt_box">
                                    <div className="leader_pwt_head">
                                        <div className="pwt_col_0_leaderboard">
                                            <div className="pwt_title_leaderboard"><h1>#</h1></div>
                                        </div>
                                        <div className="pwt_col_3_leaderboard">
                                            <div className="pwt_title_leaderboard"><h1>Address</h1></div>
                                        </div>
                                        <div className="pwt_col_2_leaderboard">
                                            <div className="pwt_title_leaderboard"><h1>Trades</h1></div>
                                        </div>
                                        <div className="pwt_col_2_leaderboard">
                                            <div className="pwt_title_leaderboard"><h1>Winrate</h1></div>
                                        </div>
                                        <div className="pwt_col_4_leaderboard">
                                            <div className="pwt_title_leaderboard"><h1>PnL</h1></div>
                                        </div>
                                    </div>
                                    {
                                        (trigiData).map((item: any, index: number) => (
                                            <div className="leader_pwt_body" key={index} style={{ backgroundColor: item.flag ? "#2a2a2a" : "none" }}>
                                                <div className="pwt_col_0_leaderboard">
                                                    <div className="leader_pwt_title">
                                                        <p>{medalAward(index + 1)}</p>
                                                    </div>
                                                </div>
                                                <div className="pwt_col_3_leaderboard">
                                                    <div className="leader_pwt_title">
                                                        <h1>{item.addy}</h1>
                                                    </div>
                                                </div>
                                                <div className="pwt_col_2_leaderboard">
                                                    <div className="leader_pwt_title">
                                                        <h1>{item.count}</h1>
                                                    </div>
                                                </div>
                                                <div className="pwt_col_2_leaderboard">
                                                    <div className="leader_pwt_title">
                                                        <p>{item.win_rate}%</p>
                                                    </div>
                                                </div>
                                                <div className="pwt_col_3_leaderboard">
                                                    <div className="leader_pwt_title">
                                                        <div style={{ color: (item.pnl > 0) ? '#0fbf92' : "#ff5858" }}>{item.pnl}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}