const axios = require('axios');
module.exports = async function (context, eventHubMessages) {

    
     var payload = JSON.stringify({
    eventHubMessages
  });

  const host = 'azure-collector-hub'
  const logfile = 'collector'
  const token = '0UdKBekTeV61BbL3QhJALJOwpYpTQujQMDpLNwnxgr5k-'

  const options = {
  method: 'post',
  headers: {
       'Content-Type': 'application/json',
        }
    };
  const url = `https://app.scalyr.com/api/uploadLogs?token=${token}&host=${host}&logfile=${logfile}&parser=azureMetrics`;

try {
    context.log("sending payload to"+url);
    var response = await axios.post(url,payload,options);
    context.done();
    return response;
}
catch (error) {
    context.log(error);
}


};