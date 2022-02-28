import React,{useEffect, useState} from "react"
import logo from './logo.svg';
import './App.css';
import {getWeb3, getRentContract} from "./utils.js"

function App() {
  const [web3, setWeb3]  = useState(undefined)
  const [accounts, setAccounts]  = useState(undefined)
  const [rEsc, setrEsc]  = useState(undefined)

  useEffect(()=> {
    const init = async() => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts()
      const rEsc = await getRentContract(web3)
      setWeb3(web3)
      setAccounts(accounts)
      setrEsc(rEsc)
    }
    init()
  },[])

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
        <div className="d-md-flex align-items-center justify-content-between">
          <div className="">
            <h3 className="text-center">Rent Escrow Center</h3>
            <p className="lead">Here you can manage your rent escrow proposal.
            As a <span className="fw-bold">Landlord</span> you can create rent contracts or redeemProposal. As a <span className="fw-bold">Tenant</span> you can accept both. </p>
            {/* Listing contracts */}
            <ul className="list-group-flush">
              <li className="list-group-item d-md-flex justify-content-between align-items-center">
                <span class="badge bg-primary rounded-pill">Redeem Proposal Waiting</span>
                <p className="text-left m-3">4d6f73742070656f706c652061726520666</p>
                <a href="#" className="btn btn-small btn-secondary text left">Accept</a>
              </li>
            </ul>
            <div className="d-md-flex align-items-center justify-content-between">
              <a href="#" className="btn btn-primary">Create New Rent Contract</a>
              <h2>Contract Look up will go here</h2>
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
