# LannisterPay
An API service for a fictional payment processor (LannisterPay)

The API supports the functionalities below:

 Fee configuration creation (POST /fee)  
 compute the fee applicable to the transaction based on the stored configuration (/POST compute-transaction-fee)  

# Tools and Technology
node (Version 14.18.1)  
npm (Version 6.14.15)  
express (Version 4.17.3)  
cors (Version 2.8.5)  
express-validator (Version 6.14.0): Validates the request payload  
sqlite3 (Version 5.0.2): I chose to use sqlite3 as the database for easy access to querying the database and consequently reduce the response time  

# How to Start
Git clone git clone https://github.com/nenatesz/LannisterPay.git  
cd lanisterpay  
Local setup  
npm install to install dependencies  
npm run dev to start development server  
On postman, run the server endpoints, http://localhost:5050/  
using the deployed server on heroku https://clonelannisterpay.herokuapp.com/..  
npm run test to run all test suites using mocha and chai  



