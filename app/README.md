# app
A [Sails](http://sailsjs.org) application!

The app is running [here](http://82.196.15.113:1337/api)

To set up development server:  
1. make sure you have [node.js] (https://nodejs.org/en/) installed  
2. make sure you have [mongodb](https://www.mongodb.com) installed  
3. install [sails.js] (http://sailsjs.org/get-started) with npm  
4. clone or fork this repo  
5. run npm install to install dependencies  
6. start mongodb in your terminal using ```mongod```   
7. run sails lift to start development server   
8. navigate to localhost:1337/api   

To create an admin-user, navigate to app/api/models/User.js. Change admin.defaultsTo:true. Start development server. Create a new user.
Stop server and change back to admin.defaultsTo:false. Start development server again and create new users, log in as admin or log in as other users and play around!
Please raise an issue or contact me if you have any questions!


