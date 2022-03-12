import React,{useEffect, useState} from "react"
import './App.css';
import {getWeb3, getRentContract} from "./utils.js"
import CreateRentContract from "./CreateRentContract.js"
import ListContracts from "./ListContracts.js"
import SearchContract from "./SearchContract";

//collapse

function App() {
  const [web3, setWeb3]  = useState(undefined)
  const [accounts, setAccounts]  = useState(undefined)
  const [rEsc, setrEsc]  = useState(undefined)
  const [currentAccount, setCurrentAccount]  = useState(undefined)
  const [listContracts, setListContracts]  = useState([])
  const [isUserLandlord, setIsUserLandlord]  = useState(true)
  const [activeContract, setActiveContract]  = useState(undefined)
  const [activeContractId, setActiveContractId]  = useState(undefined)

  const defaultActiveContract = {
    "landlord": "Search for valid contract", 
    "escrowValue":"Search for valid contract",
    "contractDetail":"Search for valid contract",
    "status":"Search for valid contract"}

    // this is initial load only
  useEffect(()=> {
    const init = async() => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts()
      const rEsc = await getRentContract(web3)
      setWeb3(web3)
      setAccounts(accounts)
      setrEsc(rEsc)
      setCurrentAccount(accounts[0])
      setListContracts(await rEsc.methods.getContractsByAddress().call({from: currentAccount}))
      setActiveContract(defaultActiveContract)

    }
    init()
  },[])

 // this is updated based on dependency
  useEffect(() => {
    const init = async () => {
      rEsc&& await setListContracts(await rEsc.methods.getContractsByAddress().call({from: currentAccount}))
     }
  init()
  },[currentAccount])

  const handleLandlordChange = () => {
    setIsUserLandlord(!isUserLandlord)
    isUserLandlord ? setCurrentAccount(accounts[0]):setCurrentAccount(accounts[1])

  }

  const submitRentContract = async  (newContract) => {
    await rEsc.methods
    .proposeNewContract(newContract["escrowValue"],newContract["contractDetail"])
    .send({from: currentAccount,gas: 1000000})
    
    setListContracts(await rEsc.methods.getContractsByAddress().call({from: currentAccount}))

  }

  const getContractDetail = async (rentId) => {
    let result = await rEsc.methods.rentContractsMapping(rentId).call() 
    // I need some error handling here in case, nothing is returned / the contract is not found
    result.landlord === "0x0000000000000000000000000000000000000000" ?  setActiveContract(defaultActiveContract): setActiveContract(result)
  }

  const acceptRentContract = async (rentId) => {
    await rEsc.methods
    .acceptNewContract(rentId)
    .send({from: currentAccount,value: Number(activeContract.escrowValue), gas: 1000000})

    setListContracts(await rEsc.methods.getContractsByAddress().call({from: currentAccount}))
  }



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
      </div>
    </nav>

    //Main box
    <section className="p-5">
      <div className="container mb-5">
       
          <div className="">
            <h3 className="text-center">Rent Escrow Center</h3>
          <button className="btn btn-primary" onClick = {() => handleLandlordChange()}>{`${currentAccount} is Landlord: ${isUserLandlord}`}</button>
            <p className="lead">Here you can manage your rent escrow proposal.
            As a <span className="fw-bold">Landlord</span> you can create rent contracts or redeemProposal. As a <span className="fw-bold">Tenant</span> you can accept both. </p>
            {/* Listing contracts */}
            <ListContracts listContracts = {listContracts} rEsc = {rEsc}></ListContracts>
            <div className="d-md-flex align-items-center justify-content-between">
              <button className="btn btn-primary" onClick={()=> setIsUserLandlord(true)}>
                Landlord: Create new Rent Contract
              </button>
              <button className="btn btn-primary" onClick={()=> setIsUserLandlord(false)}>
                Tenant: Accept rent Contract
            </button>
            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#accept" >
                Landlord: Create Redeem
            </button>
            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#accept" >
                Tenant: Accept Redeem
            </button>

            </div>
            
              <div className="container bg-light p-5">      
            <h4 className="">Rent Contract Details</h4>
            {/* This is visible only for Tenants */}
            {!isUserLandlord &&
            <SearchContract
            setActiveContractId = {setActiveContractId}
            getContractDetail = {getContractDetail}
            activeContractId = {activeContractId}>
            </SearchContract>
            }
            <CreateRentContract 
              submitRentContract = {submitRentContract} 
              isUserLandlord = {isUserLandlord}
              getContractDetail = {getContractDetail}
              activeContract = {activeContract}
              currentAccount = {currentAccount}
              acceptRentContract = {acceptRentContract}>
              </CreateRentContract>
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
