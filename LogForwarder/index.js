const axios = require("axios");
module.exports = async function (context, eventHubMessages) {
  let host = process.env.SCALYR_HOST || "azure-eventhub";
  let logfile = process.env.SCALYR_LOGFILE || "eventhub";
  let token = process.env.SCALYR_WRITE_EVENTS_KEY;
  let region = process.env.SCALYR_REGION;
  let parser = process.env.SCALYR_PARSER || "azure";

  var options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (!token) {
    context.log.error(
      "Error: Scalyr API Key is not defined. Please define App Configuration SCALYR_WRITE_EVENTS_KEY"
    );
    context.done("error");
  }
  if (region) {
    var url = `https://app.${region}.scalyr.com/api/uploadLogs?token=${token}&host=${host}&logfile=${logfile}&parser=${parser}`;
  } else {
    var url = `https://app.scalyr.com/api/uploadLogs?token=${token}&host=${host}&logfile=${logfile}&parser=${parser}`;
  }

  const sendEventMessage = function (eventMessage) {
    
      const result = axios.post(url, eventMessage, options).catch(function (error){
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          context.log("Server Responded with eror:",error.response.data);
          context.log("Status was",error.response.status);
        }
        else if (error.request) {
          context.error("Request Error:",error.request);
        }
        else {
          context.log(
            "FATAL: Event was not sent. Your setup may be incorrect: ",
            error.message
          ); 
      }
    });
  };

  eventHubMessages.forEach((message, index) => {
    if (typeof message === "object") {
      var msg = JSON.parse(JSON.stringify(message));
      msg.records.forEach((snippet, i) => {
        sendEventMessage(snippet);
      });
    }
  });

  context.done();
};
