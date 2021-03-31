const express = require("express");
const app = express();
const cors = require("cors");
const minify = require("html-minifier").minify;

app.use(express.json({ limit: "50mb" }));
app.use(cors());
const port = process.env.PORT || 3000;

function processData(json_data) {
  const details = json_data.details;
  const connections = JSON.parse(details).connections;
  // console.log(connections);
  let newDetails = [];
  connections.forEach((connection) => {
    let newConnection = {};
    if (connection.names) {
      newConnection.name = connection.names[0].displayName;
    }
    if (connection.phoneNumbers) {
      newConnection.phoneNumber = connection.phoneNumbers[0].value
        .split(" ")
        .join("");
    }
    if (connection.photos) {
      newConnection.photo = connection.photos[0].url;
    }
    if (connection.emailAddresses) {
      newConnection.emailAddress = connection.emailAddresses[0].value;
    }
    newDetails.push(newConnection);
  });

  let newData = {
    personal: JSON.parse(json_data.personal),
    contacts: newDetails,
  };
  let html = generateContactsHtml(newData);
  return html;
}

function generateContactsHtml(data) {
  let html1 = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.gstatic.com"> 
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet">
    <link rel = "stylesheet" href="./style2.css">
    <title>Contacts.html</title>
</head>
<body>
    
    <header>
            <div class="profile-container">

                    <svg width="255" height="78" viewBox="0 0 255 78" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path opacity="0.6" d="M198.968 -45.7106C218.956 -3.09177 236.394 82.0419 150.931 122.123C108.358 142.089 19.9371 99 19.9374 60.7641C19.9374 32.9115 32.3891 32.4124 74.9619 12.4464C117.535 -7.51964 178.98 -88.3295 198.968 -45.7106Z" fill="url(#paint0_linear)"/>
                        <path d="M117.5 39C117.5 54.7401 104.74 67.5 89 67.5C73.2599 67.5 60.5 54.7401 60.5 39C60.5 23.2599 73.2599 10.5 89 10.5C104.74 10.5 117.5 23.2599 117.5 39Z" stroke="white"/>
                        <circle cx="89" cy="39" r="26" fill="#C4C4C4"/>
                        <circle cx="89" cy="39" r="26" fill="url(#pattern0)"/>
                        <circle cx="89" cy="39" r="26" stroke="white" stroke-width="2"/>
                        <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1.01235" height="1.51852">
                        <use xlink:href="#image0" transform="scale(0.0140604)"/>
                        </pattern>
                        <linearGradient id="paint0_linear" x1="11.0295" y1="19.3265" x2="191.153" y2="-64.0925" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#097AFF"/>
                        <stop offset="1" stop-color="#0041E8"/>
                        </linearGradient>
                        <image id="image0" width="72" height="75" href= "${data.personal.photo}"></image>
                        </defs>
                        </svg>

                <div id ="profile-name">${data.personal.name}</div>
                <div id ="profile-email"> ${data.personal.email}</div>
            </div>

            <div class = logout-container>
                <svg width="201" height="78" viewBox="0 0 201 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.6" d="M199.949 -45.7106C219.937 -3.09177 237.376 82.0419 151.912 122.123C109.339 142.089 20.9183 99 20.9186 60.7641C20.9186 32.9115 33.3703 32.4124 75.9431 12.4464C118.516 -7.51964 179.962 -88.3295 199.949 -45.7106Z" fill="url(#paint0_linear)"/>
                    <path d="M109 38.9377H131.405" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M126.067 44.2723L131.402 38.9378L126.067 33.6032" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M112.633 45.4757C115.655 51.684 122.538 55.0118 129.281 53.5244C136.023 52.0369 140.868 46.1219 140.997 39.2184C141.127 32.315 136.508 26.2224 129.825 24.4832C123.143 22.7439 116.14 25.8112 112.887 31.9017" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                    <linearGradient id="paint0_linear" x1="12.0107" y1="19.3265" x2="192.134" y2="-64.0925" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#097AFF"/>
                    <stop offset="1" stop-color="#0041E8"/>
                    </linearGradient>
                    </defs>
                    </svg>
            </div> 
        
    </header>

    <div class = "second-part">
    <div class="contacts-container">

    <div id = "contacts-tag-container">
        <h2 id="contacts-tag">Contacts</h2>
        <div id ="total-contacts">(${data.contacts.length})</div>
    </div>

        <div class = "tags-container">
            <p id ="name-tag">NAME</p>
            <p id = "email-tag">EMAIL</p>
            <p id = "phone-tag">PHONE NUMBER</p>
         </div>
`;

  html2 = ``;
  const l = data.contacts.length;
  for (let i = 0; i < l; i++) {
    let htmlFragment = "";

    // if (data.contacts[i].phoneNumber != null) {
    htmlFragment = `

        <div class = "contact-container">
            <div id = "dpname-container">
                <image id = "contact-dp" width="40" height="40" src="${
                  data.contacts[i].photo || ""
                }"></image>

         <div id = "contact-name">${data.contacts[i].name || ""}</div>

        </div>

            <div id = "email-container"> ${data.contacts[i].email || ""}</div>
             <div id = "contact-phone-number"> ${
               data.contacts[i].phoneNumber || ""
             }
             </div>
            
            <svg id = "trashcan" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.52332L17.54 2.00774" stroke="#053ED1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5413 1.02613L6.99832 1.77901C6.68409 1.8451 6.40912 2.0336 6.23415 2.30284C6.05919 2.57209 5.99864 2.89993 6.06588 3.21391L6.31711 4.39597L12.2242 3.13983L11.973 1.95857C11.9068 1.64503 11.7188 1.37062 11.4503 1.19574C11.1818 1.02086 10.8548 0.959843 10.5413 1.02613Z" stroke="#053ED1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.24646 14.8896V8.85049" stroke="#053ED1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.8701 14.8896V8.85049" stroke="#053ED1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.5877 5.22699H16.7014L15.5862 18.009C15.5341 18.6368 15.0083 19.1192 14.3784 19.117H5.73436C5.10627 19.1167 4.58328 18.635 4.53136 18.009L3.69635 7.94621" stroke="#053ED1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                
        </div>
`;
    html2 = html2 + "\n" + htmlFragment;
  }

  let html3 = `
  </div>
</body>
</html>
  `;
  let finalHtml = html1 + html2 + html3;
  let minifyHtml = minify(finalHtml);
  return minifyHtml;
}

app.use((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
});

app.post("/data", (req, res) => {
  let json_data = req.body;
  let contacts = processData(json_data);
  res.send(contacts);
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
