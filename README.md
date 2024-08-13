## Minds behind this project
[Harshita Khattar](https://github.com/hkhattar22) <br>
[Ikjot Singh](https://github.com/IkjotSingh221) <br>
[Prisha Sawhney](https://github.com/prishasawhney) <br>
[Anmol Mago](https://github.com/terminal-lucidity) <br>

## Running the Application Locally

### Frontend
* Install dependencies: `npm install`
* Start the application: `npm start`

### Backend
* Install dependencies: `pip install -r requirements.txt`
* Run the application: `python app.py`

**Note:**
* Ensure you have a `.env` file configured with environment variables like Gemini API Key and Firebase configurations.
Make sure to attach your specific serviceaccountkey.json file as well.
Your Firebase configurations can be seen in the account settings in the following format
```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_FOR_FIREBASE",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```
You may set these values in the code itself or use a .env file (as in our project). 
The same configurations can be done to retrieve the GEMINI_API_KEY from the .env file.

Sample format of .env file:
VARIABLE_NAME="VALUE"

**Additional Links:**
Working Demo Video: [Litt Labs](YoutubeLinkToBeAdded)



