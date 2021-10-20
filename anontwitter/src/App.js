import {useState, useEffect} from "react";
import abi from "./utils/AnonTwitter.json";
import {ethers} from "ethers";
function App(){
    const [meta, setMeta] = useState(false);
    const [wallet, setWallet] = useState("");
    const [data, setData] = useState();
    const [text, setText] = useState();
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
                try{
                  const providers = new ethers.providers.Web3Provider(ethereum);
                  const signers = providers.getSigner();
                  const AnonTwitter = new ethers.Contract("0xa69c779C7f9B49dd363283B85800A6667fA74B14",abi.abi,signers);
                  setData(await AnonTwitter.getAllTweets());
                } catch(err) {
                  console.log(err);
                }
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
              }else{
                setMeta(true);
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
      const createText = (e) => {
        e.preventDefault();
        create().then().catch(err => console.log(err));
      }
      const create = async() => {
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
                try{
                  const providers = new ethers.providers.Web3Provider(ethereum);
                  const signers = providers.getSigner();
                  const AnonTwitter = new ethers.Contract("0xa69c779C7f9B49dd363283B85800A6667fA74B14",abi.abi,signers);
                  const txn = await AnonTwitter.createTweet(text.toString());
                  await txn.wait();
                  setData(await AnonTwitter.getAllTweets());
                } catch(err) {
                  console.log(err);
                }
            }
          }catch(err){
            console.log(err);
          } 
        }
      }
    return (
     <>
     {
         meta ? (<>
         {
           wallet ? <>
            <center>
              <h1>Create your tweet like no one knows who created it...</h1>
              <p>Select Goerli Network</p>
               <br />
               <br />
               <hr/>
               <form onSubmit={createText}> 
                 <input type="text" onChange={e => setText(e.target.value)} />
                 <button type="submit">Create your tweet</button>
               </form>
              {data ? data.map((e,i) => <><br /><hr /><h3 key={i}>{e.message}</h3><p>created at : {new Date(e.time*1000).toLocaleString()}</p></>) : null}
            </center>
           </> : <h1>Please Connect your wallet <button onClick={connectWallet}>Connect</button></h1>
         }
         </>) : <h1>Please Install a Wallet</h1>
     }
           <h1>Learning Path from questbook.app</h1>

     </>
    )
}
export default App;