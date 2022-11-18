import { Actor, HttpAgent } from "@dfinity/agent";
import * as identity from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import bip39  from "bip39";
import hdkey from "hdkey";
import {idlFactory, canisterId} from './interface';



export const getPrice = async (pair:any) => {

    const host = 'https://ic0.app'

    const agent =new HttpAgent({host});

    const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId
    });

    var f = await actor.get_data(parseInt(pair));

    return f;
}

export const checkSigs = async function checkSigs(sigs:any) {
    let fSigs:any = [];
    for(var i=0; i<Object.keys(sigs).length; i++) {
        var sig = sigs[i];
        var now = new Date().getTime();
        var diff = now - parseInt(sig.timestamp);

        //if(diff < 10*1000) {
            fSigs.push(sig.signature);
            fSigs.push(sig.price);
            fSigs.push(sig.timestamp);
            fSigs.push(sig.provider);
            fSigs.push(sig.isClosed);
        //}
        console.log(diff);
    }

    return fSigs;
}

export const getData = async function checkSigs(asset:any) {
    let fSigs:any = [];

    await fetch('https://tigristrade.info/c-oracle/price/'+asset).then(async (r) => {
        if(!r.ok) {
            fSigs = false;
        }

        await r.json().then((rr) => {
            var sig = rr.data;
            fSigs.push(sig.signature);
            fSigs.push(sig.price);
            fSigs.push(sig.timestamp);
            fSigs.push(sig.provider);
            fSigs.push(sig.isClosed);

        }).catch(async () => {
            fSigs = false;
        })    
    }).catch(async () => {
        fSigs = false;
    });

    return fSigs;
}