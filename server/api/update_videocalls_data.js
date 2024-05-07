const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
  clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
});

const sdkUtil = sharetribeIntegrationSdk.util;


//This endpoint is used to send new Proposal Agreement from Influencer to Seller
module.exports = async (req, res) => {

  const sellerIsAuthor = req.body.sellerIsAuthor;
  const listingSignature = req.body.sig;
  const listingId = req.body.listingId;
  const partyA = req.body.sellerId.uuid;
  const partyB = req.body.influencerId.uuid;

  const separateObject = obj => {
  
   if(listExist)return[];
  
   if(obj === undefined || obj === null)return[];
   const res = [];
   const keys = Object?.keys(obj);
   keys.forEach(key => {
     
     try{
         if(parseInt(obj[key]) !== undefined && obj[key].sig === listingSignature){
          if((partyA === obj[key].partyA && partyB === obj[key].partyB) || (partyB === obj[key].partyA && partyA === obj[key].partyB))
           listExist = true;
         }
         res.push(
           obj[key]
         );
         
     }catch(error){}
    
   });
   return res;
 };

 const checkIfExist = (obj) => {
  
   if(obj === undefined || obj === null)return[];
   const keys = Object?.keys(obj);
   keys.forEach(key => {
     try{
         if(parseInt(obj[key]) !== undefined && obj[key].sig === listingSignature){
          
           listExist = true;
         }
     }catch(error){}
   });
  ;
 };

//Update either a Buyer or Author Info
const updateUser = (isSeller)=>{
  const userId = isSeller?partyA:partyB;
 const parameters ={
   id: userId
 };

 //Get Author profile info including profile image Id
 integrationSdk.users.show(
   parameters
 ).then(res => {
  
   const currentListing = res?.data.data.attributes.profile.privateData.Agreements;
   const role = res?.data.data.attributes.profile.protectedData.role;
   
   
   checkIfExist(currentListing);
   if(role==="Influencer"){
    updateUserProfileData(currentListing,true);
   }else{
    updateUserProfileData(currentListing,false);
   }
   
   
 })

 function updateUserProfileData (currentListings,isInfluencer){
   
  if(listingImage === true || listingImage === false)return;

  //alternateListingSellersPayToId = isInfluencer?alternateListingSellersPayToId:"";

  //Updating Influencer Information
  //Check if the post blong to the Seller or Influencer before updating
   const listingDetails = {
     sig:listingSignature,
     listingId:listingId,   //Id of the listing that is being paid forr
     partyA:partyA,
     partyB:partyB,
     partyAName:partyAName,
     partyBName:partyBName,
     partyAProfileImage:partyAProfileImage,
     partyBProfileImage:partyBProfileImage,
     listingPhoto:listingImage,
     deliveryDate:"",
     status:"Not Started",
     dueDate:""+dueDate,
     submissionDate:"",
     completed:false, 
     agreementAccepted : agreementAccepted,
     agreementCancel : agreementCancel,
     showAgreement : showAgreement,
     startDate :""+startDate,
     dueDate : ""+dueDate,
     amount:amount,  
     description:description,  
     alternateListingSellersPayToId:alternateListingSellersPayToId,
     from:from,
     listingPhoto:listingPhoto,
     newPrice:0,
     productDeliveryAddress:"",
     productVideoUrl:"",
     status0NextStatus:"SendProductDeliveryAddressForm",
     status1SendProductDeliveryAddressForm:false,
     status2AcceptProductDeliveryAddressForm:false,
     status3SendProductToAddress:false,
     status4ConfirmProductReceipt:false,
     status5SendVideoUrl:false,
     status6ConfirmVideoUrlReciept:false,
     status7AcceptProduct:false,
     status8ProjectClosure:false,

   }

   console.log(listingImage +"  --------------------listingImage------------------------  ");
   
   const newCon = separateObject(currentListings);
   
   newCon.push(listingDetails);
 
   //convert array to object
   const updatedAgreement = Object.assign({},newCon);

   //compile user data
   const id = isSeller? partyA:partyB;
  integrationSdk.users.updateProfile(
   {
     id: id,
     privateData: {
       Agreements:updatedAgreement,
     },
     metadata: {
       identityVerified: true
     }
   }, {
     expand: true,
     include: ["profileImage"]
   }

 ).then(res => {
   console.log(`Success with status: ${res.status} ${res.statusText}`);
   })
   .catch(res=>{
     console.log(`Request failed with status: ${res.status} ${res.statusText}`);
   });
 };

 }

 const getPartyAData = (id)=>{
  const parameters ={
    id: id,
    include: ['profileImage'],
    'fields.image': [
      'variants.square-small',
      'variants.square-small2x',
      'variants.square-xsmall',
      'variants.square-xsmall2x',
    ],
    'imageVariant.square-xsmall': sdkUtil.objectQueryString({
      w: 40,
      h: 40,
      fit: 'crop',
    }),
    'imageVariant.square-xsmall2x': sdkUtil.objectQueryString({
      w: 80,
      h: 80,
      fit: 'crop',
    }),
  };
 
  //Get Author profile info including profile image Id
  integrationSdk.users.show(
    parameters
  ).then(res => {
   
    const {firstName, lastName} = res?.data.data.attributes.profile;
    //const role = res.data.attributes.profile.protectedData.role;
    partyAName = firstName +" "+ lastName;
    
    // if(role==="Influencer"){
    //   //Get the listings for this Influencer
    //   //Then look for the one to use as alternateListingSellersPayToId
    // }
    try{
      partyAProfileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
   
  })
 }

 
 const getPartyBData = (id)=>{
  const parameters ={
    id: id,
    include: ['profileImage'],
    'fields.image': [
      'variants.square-small',
      'variants.square-small2x',
      'variants.square-xsmall',
      'variants.square-xsmall2x',
    ],
    'imageVariant.square-xsmall': sdkUtil.objectQueryString({
      w: 40,
      h: 40,
      fit: 'crop',
    }),
    'imageVariant.square-xsmall2x': sdkUtil.objectQueryString({
      w: 80,
      h: 80,
      fit: 'crop',
    }),
  };
 
  //Get Author profile info including profile image Id
  integrationSdk.users.show(
    parameters
  ).then(res => {
   
    const {firstName, lastName} = res?.data.data.attributes.profile;
    partyBName = firstName +" "+ lastName;
    
    try{
      partyBProfileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
   
  })
 }

const updateUserAgreement = async (userId) => {
  //Get the image url
  await integrationSdk.listings.show({
    id: listingId,
    include: ["images"],
    "fields.image": ["variants.square-small", "variants.my-variant"],
    // SDK provides a util function to construct image variant URL param strings
    "imageVariant.my-variant": sdkUtil.objectQueryString({
      w: 320,
      h: 640,
      fit: 'scale'
    })
  })
  .then(res => {

    
    listingImage = res?.data.included[0].attributes.variants["square-small"].url;
    amount = res?.data.data.attributes.price.amount;
    description = res?.data.data.attributes.description;

    //console.log(sellerIsAuthor + "      Creating listing copy  starting       ---------------------------------------------  "+userId+"  "+partyB);
    if(sellerIsAuthor && userId === partyB){
      //Create a duplicate copy of listing
      //console.log("Creating listing copy         ---------------------------------------------");

      //listingDetails = res.data;
     

    }

    amount = parseInt(amount) /100;
    console.log(listingImage +"  ooooooooooooooooooooolistingImageoooooooooooooooooooooooooooo    "+amount);
    updateUser(true);
  })
  .then(res => {
    console.log(listingImage +"  uuuuuuuuuuuuuuuuuuuuuuuulistingImageuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    updateUser(false);
  })
  .catch(error=>{
     // console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
  })


}

//Get the video call url from Whereby
const response = await fetch('https://api.whereby.dev/v1/meetings', {
  method: 'POST',
  headers: {
  "Content-Type": "application/json",
  Authorization: 'Bearer '+ process.env.WHEREBY_TOKEN,
  },
  body: JSON.stringify({
  "endDate": "2024-05-06T11:05:52.731Z"
  }),
});

const data = await response.json();


//Get User Data
getPartyAData(partyA);
console.log("  --------------------------Done1-------------------------    ");
getPartyBData(partyB);
console.log("  --------------------------Done2-------------------------    ");
updateUserAgreement(partyB);


 
}

