import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'
import { useAccount, useNetwork } from 'wagmi'
import "./styles.css"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export default function DailyStats() {

    const { address } = useAccount();
    const { chain } = useNetwork();

    var labels: any = [];

    const [dailyPositionsNumber, setDailyPositionsNumber] = useState(0);
    const [weeklyPositionsNumber, setWeeklyPositionsNumber] = useState(0);
    const [dailyPnl, setDailyPnl] = useState(0);
    const [weeklyPnl, setWeeklyPnl] = useState(0);
    const [updateChart, setUpdateChart] = useState(true);

    const [nftId, setNftId] = useState([]);
    const [paid, setPaid] = useState([]);
    const [logsData, setLogsData] = useState<LogsDataType[]>([]);
    const [isLoading, setLoading] = useState(false);

    
    async function getData(url: string) {
        let arrId: any = [];
        let arrPaid: any = [];
        let arrLogs: any = [];
        await fetch(url + address).then(response => {
            response.json().then(data => {
                for (let i = 0; i < data.chart.length; i++) {
                    arrId[i] = data.chart[i].nft_id;
                    arrPaid[i] = data.chart[i].paid;
                }
                for (let j = 0; j < data.logs.length; j++) {
                    arrLogs[j] = data.logs[j];
                }
                setLoading(true);
            }).catch((err) => {
                console.log("response-err: ", err);
            });
        }).catch((err) => {
            console.log("err: ", err);
        });
        setNftId(arrId);
        setPaid(arrPaid);
        setLogsData(arrLogs);
    }

    useEffect(() => {
        changeState();
    }, [])

    useEffect(() => {
        changeState();
    }, [address, chain?.id]);

    setInterval(() => { setUpdateChart(true) }, 30000);

    const changeState = () => {
        let fetchUrl: string = "";
        setLoading(false);
        if (address == undefined) return;
        if (chain?.id === 137) {
            fetchUrl = "https://tigristrade.info/stats/daily_performance/"
        } else if (chain?.id === 42161) {
            fetchUrl = "https://tigristrade.info/stats/daily_performance_arbi/"
        } 
        getData(fetchUrl);
        if (!updateChart) return;
        setUpdateChart(false);
    }

    const data = {
        labels: nftId,
        datasets: [
            {
                label: "paid",
                data: paid,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom' as const,

            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const convertTime = (timestamp: number) => {
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    }

    const isAccount = (act:any) => {
        if(act === "" || act === undefined || act === null) {
            return 0;
        }
        else {
            return 1;
        }
    }

    return (
        <div className="price_wave_table">
            <div className="performance">
                <select>
                    <option>Daily Performance</option>
                </select>
            </div>

            <div className="pnl_box">
                <ul>
                    <li>Daily PNL: <span>${dailyPnl}</span></li>
                    <li>Weekly PNL: <span>${weeklyPnl}</span></li>
                    <li>Number of Settled Positions(24hr): <span>{dailyPositionsNumber}</span></li>
                    <li>Number of Settled Positions(7d): <span>{weeklyPositionsNumber}</span></li>
                </ul>
            </div>
            {!isAccount(address)  ? <h4 className='noData'> Wallet is not connected </h4> : 
            isLoading ?
                <div className="btc_items" style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: "60%", background: '#0B0E11', padding: '15px 15px', borderRadius: '10px' }}>
                        <div className="btc_body" >
                            <Line data={data} options={options} />
                        </div>
                    </div>
                    <div className="tableContainer" >
                        <table className='chartTable'>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Text</th>
                                    <th>Change</th>
                                </tr>
                            </thead>
                            <tbody className='tbody'>
                                {(() => {
                                    const arr = [];
                                    for (let i = 0; i < logsData.length; i++) {
                                        let changeVal: number = logsData[i].change;
                                        arr.push(<tr key={i}>
                                            <td>{convertTime(logsData[i].time)}</td>
                                            <td title={logsData[i].text}>{logsData[i].text}</td>
                                            <td style={{ color: (changeVal > 0) ? "#01BF92" : "#FF5858" }}>{changeVal.toFixed(2)}</td>
                                        </tr>)
                                    }
                                    return arr;
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div> : <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            }
        </div>
    );
}

interface LogsDataType {
    time: number,
    text: string,
    change: number
}