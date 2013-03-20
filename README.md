# TravelSmart London #
This is the server-side API program for the TravelSmart London platform.

## Installation ##
Clone the repository to your workspace.

## Usage ##
### Cloud9 ###
1. Open server.js and follow instructions in the file. Save server.js  
2. Run index.js

### Non-C9 ###
1. Run index.js with super user permission (i.e. sudo node index.js)

## Features ##
### Bus Countdown ###
Bus countdown can be requested at

    /bus?stop=#####

where `#####` is the 5 digit bus stop code

### Bus Stop Query ###
Bus stop locations can be requested at

    /stops?loc=######,$$$$$$,%%%

where `######` is the latitude co-ordinate, `$$$$$$` is the longitude co-ordinate and `%%%` is the radius

### Tube Countdown ###
Tube countdown can be requested at

    /tube?stop=@,$$$

where `$$$` is the 3 letter station code and `@` is the 1 letter line code

### Line Status ###
Line status can be requested at

    /lines

### Bike Docks ###
Bike dock locations can be requested at

    /bike?loc=######,$$$$$$,%%%

where `######` is the latitude co-ordinate, `$$$$$$` is the longitude co-ordinate and `%%%` is the radius

### Crowdedness ###
Crowdedness can be requested at

    /crowd?stop=###,$$$$

where `###` is the 3 digit NLC code for the station and `$$$$` is the time in 24-hour military format (e.g. 0000 for midnight)

### Weather ###
Weather can be requested at

    /weather?loc=######,$$$$$$

where `######` is the latitude co-ordinate and `$$$$$$` is the longitude co-ordinate

### Line Ratings ###
Reatings can be requested for overall line ratings or for ratings submitted only by one user. These can be accessed at 
    
    /getratings?fetchall
    
    /getratings?fetchforuser=*username*
    
where `*username*` is the username for which rating is to be retrieved 

Ratings can also be posted to the API at 

    /postratings?foruser=*username*,*lineName*=#
    
where `*username*` is the username of the user who submits the rating, `*linename*` is the name of the line and `#` is the rating int on the scale 0-5

### Comments ### 
Comments can be accessed per station overall or for an individual user. These can be requested at 

    /getcomments?fetchallforstation=###
    
    /getcomments?fetchforuser=*username*,atstation=###

where `###` is the 3 digit NLC code for the station and `*username*` is the username of the user whose comments are retrieved 

Comments can also be posted to the API at 

    /postcomment?forstation=###,user=*username*,comment=*comment*
    
where `###` is the 3 digit NLC code for the station, `*username*` is the username of the user whose comments are retrieved and `*comment*` is the user comment 

### Twitter ### 
Twitter feeds can be requested at 

    /gettwitter?fetchforstation=*station*
    
    /gettwitter?getchforline=*line*

where `*station*` is an encoded string representing the station, e.g. "Euston" for Euston Station and `*line*` is an encoded string representing a line
