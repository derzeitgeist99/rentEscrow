import React,{useEffect, useState} from "react"
import logo from './logo.svg';
import './App.css';
import {getWeb3, getRentContract} from "./utils.js"
import CreateRentContract from "./CreateRentContract.js"
import ListContracts from "./ListContracts.js"

function App() {
  const [web3, setWeb3]  = useState(undefined)
  const [accounts, setAccounts]  = useState(undefined)
  const [rEsc, setrEsc]  = useState(undefined)
  const [currentAccount, setCurrentAccount]  = useState(undefined)
  const [newContractId, setNewContractId]  = useState(undefined)
  const [listContracts, setListContracts]  = useState(undefined)

  useEffect(()=> {
    const init = async() => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts()
      const rEsc = await getRentContract(web3)
      setWeb3(web3)
      setAccounts(accounts)
      setrEsc(rEsc)
      setCurrentAccount(accounts[0])
      setListContracts(await rEsc.methods.getContractsByAddress().call({from: accounts[0]}))

    }
    init()
  },[])



  const submitRentContract = async  (newContract) => {
    const receipt = await rEsc.methods
    .proposeNewContract(newContract["escrowValue"],newContract["contractDetail"])
    .send({from: currentAccount,gas: 1000000})
    
    await setNewContractId(receipt["events"]["rentContractId"]["returnValues"]["_rentId"])

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
        <a href="#" className="navbar-brand text-secondary">RentEscrow the App</a>
      </div>
    </nav>

    //Main box
    <section className="p-5">
      <div className="container">
        <div className="d-md-flex align-items-top justify-content-between">
          <div className="">
            <h3 className="text-center">Rent Escrow Center</h3>
            <p className="lead">Here you can manage your rent escrow proposal.
            As a <span className="fw-bold">Landlord</span> you can create rent contracts or redeemProposal. As a <span className="fw-bold">Tenant</span> you can accept both. </p>
            {/* Listing contracts */}
            <ListContracts listContracts = {listContracts}></ListContracts>
            <div className="d-md-flex align-items-center justify-content-between">
              {/* <a href="#collapseExample" className="btn btn-primary" data-toggle="collapse" >Create New Rent Contract</a> */}
              <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Create new Rent Contract
            </button>


              <h2>Contract Look up will go here</h2>
            </div>
            <div className="collapse" id="collapseExample">
            <CreateRentContract submitRentContract = {submitRentContract} 
            newContractId = {newContractId}></CreateRentContract>
              </div>
            


          </div>
          <div className="">
            <h3 className="">Dispute Resolution Center</h3>
          </div>

        </div>
      </div>

    </section>
</div>

  );
}

export default App;
