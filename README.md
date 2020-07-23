# Scalyr agent for Azure
The Scalyr agent for Azure uses Azure function to forward Eventhub messages to Scalyr.
The general steps are as follows

 - Login to your Azure portal. 
 - Create an EventHub
 - Create an App Function. 
 - Select the App Service for the App Function you just created. Select `Configuration` under `Settings`
    - (required) Select `New application setting` and fill `Name` as `SCALYR_WRITE_EVENTS_KEY` and `Value` with [your Scalyr Write Api key](https://app.scalyr.com/keys).
    - Other optional parameters are `SCALYR_HOST`,`SCALYR_LOGFILE`, `SCALYR_REGION` only if not using US region, `SCALYR_PARSER`
 - Upload the source from github and deploy.
 - To send logs and metrics, you send them to eventhub configured in earlier step.
    1. visit any app, service or resource that you want to monitor and click on `Diagnostic settings` under `Monitoring`
    2. then select `Add diagnostic setting`
    3. on the next page under `log` and `metrics` select all the checkbox or those you need. Give the setting a name like `scalyr`
    4. in `Destination details` select `Stream to event hub` and select the eventhub we created earlier.
    5. save and you're done. Repeat steps 1 to 5 for other services.
 - The default parser name is `azure`  and you can use the sample from [here](https://github.com/scalyr/samples/blob/master/parsers/azure.conf)