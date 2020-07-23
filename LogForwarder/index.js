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

  const sendEventMessage = async function (eventMessage) {
    try {
      const result = await axios.post(url, eventMessage, options);
    } catch (error) {
      context.log(
        "FATAL: Event was not sent. Your setup may be incorrect: ",
        error.message
      );
    }
  };

  //@todo error handling and how to make this async.
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
