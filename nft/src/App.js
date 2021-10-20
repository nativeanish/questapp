import { useEffect, useState } from "react";
import abi from "./utils/NFT.json";
import {ethers} from "ethers";
function App(){
  const [meta, setMeta] = useState(false);
  const [wallet, setWallet] = useState("");
  const [color, setColor] = useState("");
  const [tname, setName] = useState("");
  const [text, setText] = useState("");
  const [symbol, setSymbol] = useState("");
  const [url, setUrl] = useState("");
  const isWallet = async() => {
    const {ethereum} = window;
    if(!ethereum){
      setMeta(false);
    }else{
      setMeta(true);
      try{
        const wallet = await ethereum.request({method: "eth_accounts"});
        if(!(wallet.length > 0 && wallet[0])){
          setWallet("");
        }else{
          setWallet(wallet[0]);
        }
      }catch(err){
        console.log(err);
      } 
    }
  }  

  const connectWallet = async() => {
    const {ethereum} = window;
    if(!ethereum){
       setMeta(false);
       setWallet("");
    }else{
        try{
          const wallet = await ethereum.request({method: "eth_requestAccounts"});
          if(!(wallet.length > 0 && wallet[0])){
            setWallet(""); 
            setMeta(true);
          }else{
            setWallet(wallet[0]); 
          } 
        }catch(err){
          console.log(err);
          setWallet("");
        }
    }
  }
  useEffect(() => {
    isWallet().then().catch(err => console.log(err));
  },[]);

  const createNFT = async() => {
    const {ethereum} = window;
    if(!ethereum){
      setMeta(false);
    }else{
      setMeta(true);
      try{
        const wallet = await ethereum.request({method: "eth_accounts"});
        if(!(wallet.length > 0 && wallet[0])){
          setWallet("");
        }else{
          setWallet(wallet[0]);
          try {
            const txt = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 25px; }</style><rect width="100%" height="100%" fill="${color}" /><text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">${text}</text></svg>`;
            const phase2 = `{\n\t"name":"${tname}",\n\t"description":"NFT created by learning on questbook",\n\t"image":"data:image/svg+xml;base64,${btoa(txt)}"\n}`;
            const phase3 = `data:application/json;base64,${btoa(phase2)}`;
            const providers = new ethers.providers.Web3Provider(ethereum);
            const {name} = await providers.getNetwork();
            const num = parseInt(Math.random()*100);
            const signer = providers.getSigner();
            const factory = new ethers.ContractFactory(abi.abi,abi.bytecode,signer);
            const contract = await factory.deploy(tname.toString(),symbol.toString(),Number(num),phase3.toString());
            await contract.deployTransaction.wait();
            setUrl(`https://testnets.opensea.io/assets/${name}/${contract.address}/${num}`);
          }catch(err){
            console.log(err);
          }
        }
      }catch(err){
        console.log(err);
      } 
    }
  }
  const submit = (e)  => {
    e.preventDefault();
    createNFT().then().catch(err => console.log(err));
  }
  return(
    <>
    {meta ? (
      <>
      {
        wallet ? (
          <>
            <center>
              <h1>#Create your NFT!</h1>
              <form onSubmit={submit}>
                <lable>Name:</lable><input type="text" onChange={e => setName(e.target.value)} />
                <br />
                <label>Symbol:</label><input type="text" onChange={e => setSymbol(e.target.value)} />
                <br />
                <lable>BackGround Color: </lable>
                <select id="cars" onSelect={e => setColor(e.target.value)}>
                  <option value="green">Green</option>
                  <option value="yello">Yellow</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="black">Black</option>
                  <option value="grey">Grey</option>
                </select>
                <br />
                <lable>Text You want to write: </lable> <input type="text" name="text" onChange={e => setText(e.target.value)}/>
                <br />
                <button type="submit">#Create</button>
              </form>
              {url? <h1>Visit Your NFT here : <button><a href={url} target="_blank" >opensea</a></button></h1> : null}
            </center> 
          </>
        ): <h1><center>Please Connect your Wallet <button onClick={connectWallet}>Connect</button></center></h1>
      }
      </>
    ): <center><h1>Install a Wallet and Get a address with some balances.</h1></center>}
          <h1>Learning Path from questbook.app</h1>

    </>
  )
}
export default App;