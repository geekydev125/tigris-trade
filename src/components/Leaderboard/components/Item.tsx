import { useAccount } from 'wagmi'

interface PosProps {
    user: String,
    balance: Number,
    rank: Number
}

const Item = ({user, balance, rank}: PosProps) => { 
    const { address } = useAccount();

    return (
        <div className="pwt_body">

            <div className="pwt_col_0_leaderboard">
                <div className="pwt_title">
                    <p>#{`${rank}`}</p>
                </div>
            </div>

            <div className="pwt_col_1_leaderboard">
                {user != address ? (
                    <div className="pwt_title_leaderboard">
                        <h1>{user ? user : ""}</h1>
                    </div>
                ) : (
                    <div className="pwt_title">
                        <h1>You</h1>
                    </div>
                )}
            </div>

            <div className="pwt_col_1_leaderboard">
                <div className="pwt_title">
                    <p>{`${balance}`} tigUSD</p>
                </div>
            </div>
        </div>
  );
}

export default Item;