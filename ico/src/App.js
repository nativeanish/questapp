import { useEffect, useState } from "react";
import abi from "./utils/ICO.json";
import { ethers } from "ethers";
import Invest from "./Invest";
function App(){
  const [choice, setChoice] = useState(false);
  const [select, setSelect] = useState("");
  const [isWallet, setWallet] = useState(false);
  const [account, setAccount] = useState("");
  const [tname,setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [week, setWeek] = useState(0);
  const [wait, setWait] = useState("");
  const [hatrick , setHatrick] = useState("");
  const [lt, setLt] = useState("");
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
  const launchICO = async() => {
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
            const factory = new ethers.ContractFactory(abi.abi,abi.bytecode,signer);
            const contract = await factory.deploy(tname.toString(),symbol.toString(),address,Number(week)*604800);
            setWait(`Wait while your ico is deployed on ${name} network`);
            await contract.deployTransaction.wait();
            setWait("");
            setHatrick(`https://${name}.etherscan.io/address/${contract.address}`);
            setLt(contract.address);
          }catch(err){
            console.log(err);
          }
        }
      }catch(err){
        console.log(err);
      } 
    }
  }

  const tempCreaet = (e) => {
    e.preventDefault();
    launchICO().then().catch(err => console.log(err));
  }

  useEffect(() => {
    setChoice(false);
    checkWallet().then().catch(err => console.log(err));
  },[]);  
  return(
    <>
    {!choice ? (
      <>
        <h1 align="center">What do you want ?</h1>
        <center><button onClick={() => {setSelect("start") 
        setChoice(true)}}>Start an ICO</button></center>
        <center><button onClick={() => {
            setSelect("invest");
            setChoice(true);
        }}>Invest in ICO</button></center>
      </>
    ):
      null
    }
    {
      choice && select === "start" ? 
      (
        <>
        <div>
      <h1 align="center">#Start an ICO's</h1>
      {isWallet ? <>
        {
          account ? <>(
            <h1 align="center">Start making your company public on Ethereum network</h1>
            <form onSubmit={tempCreaet}>
              <center><label>Token Name:</label><input type="text" name="token" onChange={(e) => setName(e.target.value)}/></center>
              <center><label>Token symbol:</label><input type="text" name="symbol" onChange={(e) => setSymbol(e.target.value)}/></center>
              <center><label>depositor Address:</label><input type="text" name="address" onChange={(e) => setAddress(e.target.value)}/></center>
              <center><label>Time to end in weeks :</label><input type="number" name="week" onChange={(e) => setWeek(e.target.value)}/></center>
              <center><label><button type="submit">Launch to Moon.</button></label></center>
            </form>
            {
              wait ? <center><h1>{wait}</h1></center> : null
            }
            {
              hatrick ? <center><button><a target="_blank" href={hatrick}>View on Etherscan</a></button>{lt ? <h1>For Investment Share this address {lt}</h1> : null }</center> : null
            }
          )</> : <h1 align="center">Please connect your wallet to create tokens <button onClick={connectWallet}>Connect</button></h1>
        }
      </>: <h1 align="center">Please Select a Wallet</h1>}
    </div>
        </>
      ): null
    }
    {
      choice && select === "invest" ? <Invest />: null
    }
          <h1>Learning Path from questbook.app</h1>

    </>
  )
}
export default App;