export const createRedeemProposal = async (rentId,tenantShare,landlordShare,feeShare,rEsc,currentAccount) => {
    await rEsc.methods
    .createRedeemProposal(rentId,tenantShare,landlordShare,feeShare)
    .send({from: currentAccount,gas: 1000000})
  
  }

  export const acceptRedeemProposal = async (rentId,rEsc,currentAccount) =>{
      await rEsc.methods
      .acceptRedeemProposal(rentId)
      .send({from: currentAccount,gas: 1000000})
  }

  export const rejectRedeemProposal = async (rentId,rEsc,currentAccount) => {
      await rEsc.methods
      .rejectRedeemProposal(rentId)
      .send({from: currentAccount,gas: 1000000})
  
  }

  export const disputeRedeemProposal = async (rentId,rEsc,currentAccount) => {
    await rEsc.methods
    .disputeRedeemProposal(rentId)
    .send({from: currentAccount,gas: 1000000})

}