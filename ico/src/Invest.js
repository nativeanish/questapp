import {useEffect, useState} from "react";
import { ethers } from "ethers";
import abi from "./utils/ICO.json"
function Invest (){
  const [isWallet, setWallet] = useState(false);
  const [account, setAccount] = useState("");
  const [address , setAddress] = useState("");
  const [min, setMinum] = useState("");
  const [eth, setEth] = useState(0);
  const checkWallet = async() => {
    const {ethereum} = window;
    if(!ethereum){
      setWallet(false);
    }else{
      setWallet(true);
      const wallet = await ethereum.request({method: "eth_accounts"});
      if(!(wallet.length > 0 && wallet[0])){
        setAccount("");
      }else{
        setAccount(wallet[0]);
      }
    }
  }

  const connectWallet = async() => {
    const {ethereum} = window;
    if(!ethereum){
       setWallet(false);
       setAccount("");
    }else{
        try{
          const wallet = await ethereum.request({method: "eth_requestAccounts"});
          if(!(wallet.length > 0 && wallet[0])){
            setAccount(""); 
          }else{
            setAccount(wallet[0]); 
          } 
        }catch(err){
          console.log(err);
          setAccount("");
        }
    }
  }
  const getDetails = async() => {
    const {ethereum} = window;
    if(!ethereum){
      setWallet(false);
    }else{
      setWallet(true);
      try{
        const wallet = await ethereum.request({method: "eth_accounts"});
        if(!(wallet.length > 0 && wallet[0])){
          setAccount("");
        }else{
          setAccount(wallet[0]);
          try {
            const providers = new ethers.providers.Web3Provider(ethereum);
            const signer = providers.getSigner();
            const {name} = await providers.getNetwork();
            const factory = new ethers.Contract(address,abi.abi,signer);
            setMinum((await factory.mininvestment()).toString());
          }catch(err){
            console.log(err);
          }
        }
      }catch(err){
        console.log(err);
      } 
    }
  }

  const sendETh = async(e) => {
      e.preventDefault();
      if(eth < min){

      }else{
        const {ethereum} = window;
    if(!ethereum){
      setWallet(false);
    }else{
      setWallet(true);
      try{
        const wallet = await ethereum.request({method: "eth_accounts"});
        if(!(wallet.length > 0 && wallet[0])){
          setAccount("");
        }else{
          setAccount(wallet[0]);
          try {
            const providers = new ethers.providers.Web3Provider(ethereum);
            const signer = providers.getSigner();
            const {name} = await providers.getNetwork();
            const factory = new ethers.Contract(address,abi.abi,signer);
            const txn = await factory.invest({value:ethers.utils.parseEther(eth)});
            await txn.wait();
            console.log(txn);
            console.log("Done Successfull");
          }catch(err){
            console.log(err);
          }
        }
      }catch(err){
        console.log(err);
      } 
    }
      }
  }
  useEffect(() => {
    checkWallet().then().catch(err => console.log(err));
  },[]); 
  const submit = (e) => {
      e.preventDefault();
      getDetails().then().catch(err => console.log(err));
  }

  const pay = (e) => {
    e.preventDefault();
    sendETh().then().catch(err => console.log(err));
  }
  return (
      <>
       <div>
      <h1 align="center">#Investing</h1>
      {isWallet ? <>
        {
          account ? <>(
            <h1 align="center">Start Investing Your Eth</h1>
            <form onSubmit={submit}>
                <center><label>Address of Contract: </label><input type="text" name="address" onChange={e => setAddress(e.target.value)}/></center>
                <center><button type='submit'>Submit Address</button></center>
            </form>
            {
                min ? <h1 align="center">Minimum Investment is {Number(min)/1000000000000000000} ether</h1>: null
            }
            <form onSubmit={pay}>
                <center><lable>Enter the AMT of ETH to send :</lable><input type="number" onChange={e => setEth(e.target.value)} /> </center>
                <center><button type="submit">Invest</button></center>
            </form>
          )</> : <h1 align="center">Please connect your wallet to create tokens <button onClick={connectWallet}>Connect</button></h1>
        }
      </>: <h1 align="center">Please Select a Wallet</h1>}
     </div>
      </>
  )
}
export default Invest;