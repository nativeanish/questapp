import { useEffect, useState } from "react"
import { ethers } from "ethers";
import abi from './utils/Token.json';
function App(){
  const [isWallet, setWallet] = useState(false);
  const [account, setAccount] = useState("");
  const [tname,setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [add , setadd] = useState("");
  const [wait, setWait] = useState("");
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
            setWallet(true);
          } 
        }catch(err){
          console.log(err);
          setAccount("");
        }
    }
  }

  const createToken = async() => {
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
            setadd("");
            const providers = new ethers.providers.Web3Provider(ethereum);
            const signer = providers.getSigner();
            const {name} = await providers.getNetwork();
            const factory = new ethers.ContractFactory(abi.abi,abi.bytecode,signer);
            const contract = await factory.deploy(tname.toString(),symbol.toString(),address);
            setWait("Wait while creating your token. If Your token is created below you see the link to get the etherscan page");
            await contract.deployTransaction.wait();
            setWait("");
            setadd(`https://${name}.etherscan.io/address/${contract.address}`)
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
    createToken().then().catch(err => console.log(err));
  }
  useEffect(() => {
    checkWallet().then().catch(err => console.log(err));
  },[])
  return(
    <div>
      <h1 align="center">#Creating Token</h1>
      {isWallet ? <>
        {
          account ? <>(
            <h1 align="center">Start Creating Your token</h1>
            <form onSubmit={tempCreaet}>
              <center><label>Token Name:</label><input type="text" name="token" onChange={(e) => setName(e.target.value)}/></center>
              <center><label>Token symbol:</label><input type="text" name="symbol" onChange={(e) => setSymbol(e.target.value)}/></center>
              <center><label>Token Owner Address:</label><input type="text" name="address" onChange={(e) => setAddress(e.target.value)}/></center>
              <center><label><button type="submit">Create this Token</button></label></center>
            </form>
            <center>{wait ? <h1>{wait}</h1> : null }</center>
            <center>{add ? <button><a href={add} target="_blank">View Contract</a></button> : null}</center>
          )</> : <h1 align="center">Please connect your wallet to create tokens <button onClick={connectWallet}>Connect</button></h1>
        }
      </>: <h1 align="center">Please Select a Wallet</h1>}
      <h1>Learning Path from questbook.app</h1>
    </div>
  )
}
export default App;