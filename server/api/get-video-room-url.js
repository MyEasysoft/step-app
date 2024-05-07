const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
   clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
   clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
 });

console.log( "==============Working  iiiiiiiiiiiiiiiiii==================");
module.exports = async (req, res) => {

    //let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //console.log(fullUrl);
    // console.log( "==============Working  ccccccccccccccccccc==================");
    // const data = {
    //     "templateType": "viewerMode",
    //     "isLocked": false,
    //     "roomNamePrefix": "example-prefix",
    //     "roomNamePattern": "uuid",
    //     "roomMode": "normal",
    //     "startDate": "2024-05-05T14:15:22Z",
    //     "endDate": "2024-06-06T14:15:22Z"
    //     }
  
    //   const response =await fetch('https://api.whereby.dev/v1/meetings', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer '+ process.env.WHEREBY_TOKEN,
    //     }
    //   }).then(res=>{
    //     console.log( "==============aaaaaaaaaaaaa==================");
    //     console.log(res);
    //     return res;
    
    //   }).catch(err=>{
       
    //     console.log(err +"           ==============ooooooooooo===========");
    //   });;


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

    console.log(data);

    res.send(data);


}