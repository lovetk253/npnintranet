# intranet
First, you need an account G suite
- Login https://console.developers.google.com/ 
- Create a project
- In project, create a API key, and OAuth 2.0 Client IDs with URIs is http://localhost or your domain
    Enable Admin SDK and Google Sheet API (create a google sheet for feature Leave of Absence - get spreadsheetId)
- Get apiKey and clientId in API key then replace in home.js file line 22,23
- Run login.html in localhost or deploy on your host and map your domain then go to login.html
- Login Google with account above

Note:
- Use spreadsheetId replace into js/leaveofabsence.js line 1