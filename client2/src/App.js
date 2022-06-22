import React,{useEffect, useState} from "react"
import './App.css';
import {getWeb3, getRentContract,defaultActiveContract} from "./utils.js"
import ListContracts from "./ListContracts.js"
import SearchContract from "./SearchContract";
import CreateAcceptRedeem from "./createAcceptRedeem";
import ContractDetail from "./ContractDetail.js";
import CreateContractButton from "./CreateAcceptRentButtons/CreateContractButton.js";
import AcceptContractButton from "./CreateAcceptRentButtons/AcceptContractButton.js";
import MetaMaskInfo from "./MetaMaskInfo";





function App() {
  const [web3, setWeb3]  = useState(undefined)
  const [accounts, setAccounts]  = useState(undefined)
  const [rEsc, setrEsc]  = useState(undefined)
  const [currentAccount, setCurrentAccount]  = useState(undefined)
  const [listContracts, setListContracts]  = useState([])
  const [flowStep, setFlowStep]  = useState(0)
  const [activeContract, setActiveContract]  = useState(defaultActiveContract)
  const [newContract, setNewContract] = useState({escrowValue:1000, contractDetail:"yada"})



    // this is initial load only
  useEffect(()=> {
    const init = async() => {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts()
      const rEsc = await getRentContract(web3)
      setWeb3(web3)
      setAccounts(accounts)
      setrEsc(rEsc)
      setCurrentAccount(accounts[0])
    }
    init()
  },[])

 // this is updated based on dependency
  useEffect(() => {
    const init = async () => {
      rEsc&& setListContracts(await rEsc.methods.getContractsByAddress().call({from: currentAccount}))
     }
  init()
  },[currentAccount,rEsc])




  if (
    typeof web3 === "undefined"
    || typeof accounts === "undefined"
    || typeof rEsc === "undefined"
  ) {
    return <div className="">Loading</div>
  }
  
  return (
    // navbar
    <div className="">
    <nav className="navbar navbar-expand-lg bg-dark py-3 fixed-top">
      <div className="container">
        <span className="navbar-brand text-secondary">RentEscrow the App</span>
        <MetaMaskInfo
        currentAccount = {currentAccount}
        setCurrentAccount = {setCurrentAccount}
        ></MetaMaskInfo>
      </div>
    </nav>

    //Main box
    <section className="p-5">
      <div className="container mb-5">
       
          <div className="">
            <h3 className="text-center">Rent Escrow Center</h3>
            <p className="lead">Here you can manage your rent escrow proposal.
            As a <span className="fw-bold">Landlord</span> you can create rent contracts or redeemProposal. As a <span className="fw-bold">Tenant</span> you can accept both. </p>
            
              <SearchContract
              setFlowStep = {setFlowStep}
              setActiveContract = {setActiveContract}
              rEsc = {rEsc}
              >
              </SearchContract>
            

            <ListContracts
              listContracts = {listContracts} 
              rEsc = {rEsc}
              currentAccount = {currentAccount}
              setFlowStep = {setFlowStep}
              setActiveContract = {setActiveContract}>
            </ListContracts>

            <div className="d-md-flex align-items-center justify-content-between mb-3">
              <p className={flowStep ===0 ? "btn btn-primary":"btn btn-secondary"} >
                Landlord: Create new Rent Contract
              </p>
              <p className={flowStep ===1 ? "btn btn-primary":"btn btn-secondary"}>
                Tenant: Accept rent Contract
            </p>
            <p className={flowStep ===2 ? "btn btn-primary":"btn btn-secondary"} >
                Landlord: Create Redeem
            </p>
            <p className={flowStep ===3 ? "btn btn-primary":"btn btn-secondary"} >
                Tenant: Accept Redeem
            </p>

            </div>

            
              <div className="container bg-light p-5">      
            
              <ContractDetail
                flowStep = {flowStep}
                activeContract = {activeContract}
                currentAccount = {currentAccount}
                setNewContract = {setNewContract}
                newContract = {newContract}>

              </ContractDetail>

              { flowStep === 0 && <CreateContractButton
                flowStep = {flowStep}
                newContract = {newContract}
                rEsc={rEsc}
                currentAccount = {currentAccount}
                setListContracts = {setListContracts}
                >
                </CreateContractButton>
              }

                {flowStep === 1 && <AcceptContractButton
                flowStep = {flowStep}
                activeContract = {activeContract}
                rEsc={rEsc}
                currentAccount = {currentAccount}
                setListContracts = {setListContracts}
                >
                </AcceptContractButton>
                }
            
            { (flowStep === 2 || flowStep === 3)  &&
            <CreateAcceptRedeem
              flowStep = {flowStep}
              activeContract = {activeContract}
              currentAccount = {currentAccount}
              rEsc = {rEsc}
              setListContracts = {setListContracts}
              >
            </CreateAcceptRedeem>
            }

              </div>
        
            

          </div>
        </div>
          <div className="container">
            <h3 className="text-center">Dispute Resolution Center</h3>
          </div>

    </section>
</div>

  );
}

export default App;
