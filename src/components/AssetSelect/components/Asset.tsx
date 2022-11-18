import React, { useContext, useCallback, useState, useEffect} from 'react';
import { useEthers } from "@usedapp/core";
import { ethers } from 'ethers';
import { useDisclosure } from "@chakra-ui/react";

import { getPrice, checkSigs } from '../../../price_handle/index';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { assert } from 'console';

declare var window: any
const { ethereum } = window;

interface PosProps {
    name:any;
    id:any;
    currentNetwork:any;
    changeAsset:any;
    cPrice:any;
    oPrice:any;
    dec:any;
}

const Asset : React.FC<PosProps> = ({currentNetwork, name, changeAsset, cPrice, oPrice, id, dec}) => { 

    const [isClosed, setIsClosed] = useState(false);

    useEffect(()=>{
        setIsClosed(currentNetwork.assets[id].isClosed);
    }, [currentNetwork, id]);
   
    return (
        <div className="t_body" onClick={() => {changeAsset(id)}}>
            <div className="t_col_a_1">
                <div className="t_title">
                    <h3>{name}</h3>
                </div>
            </div>

            <div className="t_col_a_2">
                <div className="t_title">
                    <h3>${isNaN(cPrice[id]) ? 0 : parseFloat(cPrice[id]).toFixed(dec)}</h3>
                </div>
            </div>

            { oPrice.length > 1 ?
                (isClosed ? (
                    <div className="t_col_a_3">
                        <div className="t_title">
                            <h3>Closed</h3>
                        </div>
                    </div>
                ) : (
                    cPrice[id]-oPrice[id])/oPrice[id]*100 > 0 ? (
                        <div className="t_col_a_3">
                            <div className="t_title c_1">
                                <h3>+{parseFloat(((cPrice[id]-oPrice[id])/oPrice[id]*100).toString()).toFixed(2)}%</h3>
                            </div>
                        </div>
                    ) : (
                        <div className="t_col_a_3">
                            <div className="t_title c_2">
                                <h3>{parseFloat(((cPrice[id]-oPrice[id])/oPrice[id]*100).toString()).toFixed(2)}%</h3>
                            </div>
                        </div>
                    )
                )
            : (
                <div className="t_col_a_3">
                    <div className="t_title">
                        <h3>0%</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Asset;