# app
A [Sails](http://sailsjs.org) application!

##Demo
A demo of the app is running at [http://82.196.15.113:1337/](http://82.196.15.113:1337/).

To log in as admin, use the following user credentials:  
username: admin@admin.se  
password: admin  

To log in as a user, use the following user credentials:  
username: user1@user.se  
password: useruser  

##To set up development server:
1. make sure you have [node.js] (https://nodejs.org/en/) installed
2. make sure you have [mongodb](https://www.mongodb.com) installed
3. install [sails.js] (http://sailsjs.org/get-started) with npm
4. clone or fork this repo
5. run npm install to install dependencies
6. start mongodb in your terminal using ```mongod```
7. run ```sails lift``` to start development server
8. Navigate to localhost:1337/apikey



#Lab 2:
Follow the instructions above to set up development-server, or use the running application at http://82.196.15.113:1337.

##API-key
To recieve an api-key, sign up as a user at localhost:1337/apikey and register an application. An api-key is then generated and can be used when making requests to the api. Alternetively, use
the demo-application:

``` username: user1@user.se```
``` password: useruser```
``` apikey: IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG```

##Auth
To create, update and delete a cafe, you need to authorise yourself. Do this through adding your user-credentials as base64-encoded authorisation-header:  
```Authorization: 'Basic email:password(base64-encoded)```  
You can encode your user-credentials by typing ```atob(email:password)``` in the browser-console. The output is the Base64-encoded string you should use.

If using the demo-app, use the header below:  
```Authorization: 'Basic dXNlcjFAdXNlci5zZTp1c2VydXNlcg=='```

##Queries
Queries can be made either as free-text-search, geographical-search, with tags or through a combination of two or more search parameters.

###Freetext-search:
make a get to ```/cafeinfo``` with param ```search=searchWord``` and ```APIKey=(apikey)```

example of free-text search to in demo-app:
<pre>http://82.196.15.113:1337/cafeinfo?APIKey=IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG&search=hugos</pre>


###Geographical-search
make a get to ```/cafeinfo``` with params ```latitude=(latitude of choice)```, ```longitude=(longitude of choice)``` and ```APIKey=(apikey)```.
IF you want to specify a maximum distance, this may be done through sending the parameter ```maxDistance=(maxdistance in meter)```. If omitted, the distance 500 meters is set by default.

example of geographical search using demo-app:
<pre>http://82.196.15.113:1337/cafeinfo?latitude=59.8586&longitude=17.6389&APIKey=IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG&maxDistance=1000</pre>


###Search per tag
By adding tags and a search-param, the result can be filtered through the different tag-values.
make a get to ```/cafeinfo``` with param ```APIKey=(apikey)``` and one or more of the following:
```name=```,```streetAddress=```, ```postalCode=```, ```createdBy=```, ```electricity=```(Value must be one of: 'everywhere', 'plenty', 'some' or 'nowhere') ,```wifi=```(value has must be one of: 'free', 'paid' or 'no').

example of request using demo-app:
```http://82.196.15.113:1337/cafeinfo?APIKey=IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG&name=Hugos Kaffe```

###Combined search
All above search-params may be combined as the user wish to make a detailed search in the database. An example of combined search using demo-app:
```http://82.196.15.113:1337/cafeinfo?latitude=59.8586&longitude=17.6389&APIKey=IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG&maxDistance=1000&name=Waynes Coffee StPer```

###Get one specific cafe
Make a get to ```/cafeinfo/:id``` to get a specific cafe.

example of request using demo-app:
```http://82.196.15.113:1337/cafeinfo/5707fe77f91e708e196fc331 ```

###Create a new cafe
post to ```/cafeinfo``` with the all of the following parameters:
1. name
2. streetAddress
3. postalCode
4. city
5. latitude
6. longitude
7. electricity (value must be one of 'everywhere', 'plenty', 'some' or 'nowhere')
8. wifi (value has must be one of: 'free', 'paid' or 'no')
9. APIKey

Make sure to add a valid Authorization-header to add the cafe.
Example of request using demo-app:

Post: ```http://82.196.15.113:1337/cafeinfo?APIKey= IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG&name=Cafe del flore&streetAddress=172, BOULEVARD SAINT-GERMAIN &postalCode=75006 &city=Paris&latitude=48.852329924&longitude= 2.326165362&electricity=plenty&wifi=free```  
Header: ```Authorization: 'Basic dXNlcjFAdXNlci5zZTp1c2VydXNlcg=='```

###Update a cafe
make a post to ```/cafeinfo``` with the parameters you want to update as well as an id of a cafe you have created (you can only change the cafes added by the user you are sending user-credentials for).

Example of request using demo-app:

Post: ```http://82.196.15.113:1337/cafeinfo?APIKey=IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG&wifi=no&id=5707ff3af91e708e196fc332&name=Ninas fik```  
Header: ```Authorization: 'Basic dXNlcjFAdXNlci5zZTp1c2VydXNlcg=='```

###Delete a cafe
make a delete to ```/cafeinfo``` with an id of a cafe you have created

Example of request using demo-app:  
Delete:```http://82.196.15.113:1337/cafeinfo/570648aa0d341c43068a74dd?APIKey=IYpkp6UBo7zHCUBdql2owk2ZPLs7OBEG```  
Header: ```Authorization: 'Basic dXNlcjFAdXNlci5zZTp1c2VydXNlcg=='```


###Postman-collection
A postman-collection with all available requests can be found [here](https://github.com/Angamanga/1dv450-ki222bj/blob/master/1DV450-ki222bj-lab2.json.postman_collection).

###Exceptions
I think I misunderstood the way tags are supposed to be implemented and therefore, the functionality is not perfect at the moment. I thought I should choose a number of tags which the users could set a value on but I have now
realised the tags should be like key-words which can be added by the users. That functionality is not present at the moment due to time-constraints. However, I'll sort that out when doing the client-application.

#Lab 1:
Navigate to localhost:1337/apikey or http://82.196.15.113:1337/apikey if using demo-application.

###Creating an admin-user(if using the app on localhost, only needed for lab 1).
To create an admin-user, navigate to app/api/models/User.js. Change admin.defaultsTo:true. Start development server. Create a new user.
Stop server and change back to admin.defaultsTo:false. Start development server again and create new users, log in as admin or log in as other users and play around!
Please raise an issue or contact me if you have any questions!
