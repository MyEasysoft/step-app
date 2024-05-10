

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
  clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
});

module.exports = async (req, res) => {

// Create new SDK instance
  console.log("Starting --------------------------------------------");
   // Create new SDK instance
// To obtain a client ID, see Applications in Flex Console

  let listExist = false;

  const buyerId = req.body.buyerId;
  const authorId =  req.body.authorId;
  const listingId =  req.body.listingId;
  let sig = authorId+buyerId+listingId;


  //////////////////////////WHEREBY API CALL/////////////////////////////////////////
//Get the video call url from Whereby
const response = await fetch('https://api.whereby.dev/v1/meetings', {
  method: 'POST',
  headers: {
  "Content-Type": "application/json",
  Authorization: 'Bearer '+ process.env.WHEREBY_TOKEN,
  },
  body: JSON.stringify({
    "isLocked":true,
  "endDate": "2024-05-27T11:05:52.731Z",
  fields: ["hostRoomUrl"],
  }),
});
const data = await response.json();
////////////////////////////WHEREBY API CALL END////////////////////////////////////////

  const separateObject = obj => {
    if(listExist)return[];
   
    if(obj === undefined || obj === null)return[];
    const res = [];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      try{
          res.push(
            obj[key]
          );
      }catch(error){}
     
    });
    return res;
  };

  const checkIfExist = (listingPaidFor,listingSigToGet) => {
  
    if(listingPaidFor === undefined || listingPaidFor === null)return[];
    let exist = false;
    const keys = Object?.keys(listingPaidFor);
    keys.forEach(key => {
      
      try{
          if(listingPaidFor[key].sig === listingSigToGet){
            exist = true;
          }
          
      }
      catch(error){
        console.log(error);
      }
     
    });
    return exist;
  };

//Update either a Buyer or Author Info
const updateUser = (isSeller)=>{
 
   let userId = isSeller?authorId:buyerId;
  const parameters ={
    id: userId
   };
 
  //Get Author profile info including profile image Id
  integrationSdk.users.show(
    parameters
  ).then(async res => {
   
    const currentListing = res?.data.data.attributes.profile.privateData.listingPaidFor;
    console.log("Step G   --------------------------------------");
    console.log(JSON.stringify(currentListing));
    updateUserProfileData(currentListing);
  })

  const updateUserProfileData = (currentListings)=>{
    if(checkIfExist(currentListings,sig)){return;}

    console.log(JSON.stringify(currentListing));
    console.log("Step H   ------------------------------------");
    //New listing to be added
    const listingDetails = {
      sig:sig,
      listingId:listingId,   //Id of the listing that is being paid for
      videoCallData:data,            
    };

    //get listing object
    const newCon = separateObject(currentListings);
    newCon.push(listingDetails);
    const updatedListing = Object.assign({},newCon);

    //compile user data
    const id = isSeller? buyerId:authorId;
    
    console.log("Step I   ------------------------------------");
    integrationSdk.users.updateProfile(
    {
      id: id,
      privateData: {
        listingPaidFor:updatedListing,
      },
     
    }

  ).then(res => {
    console.log(`Success with status: ${res.status} ${res.statusText}`);
    })
    .catch(res=>{
      console.log(`Request failed with status: ${res.status} ${res.statusText}`);
    });
  };

  }

await updateUser(true);
await updateUser(false);
await res.send({data:"successful"});


}




