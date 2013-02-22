# TravelSmart London 2.0 #
This is a rewrite of the server-side program for the TravelSmart London platform.

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

    /bus?stopcode1=#####

where ##### is the 5 digit bus stop code

### Bus Stop Query ###
Bus stop query can be requested at

	/stops?rad=######,$$$$$$,%%%

where ###### is the latitude co-ordinate, $$$$$$ is the longitude co-ordinate and %%% is tha radius

### Tube Countdown ###
Tube countdown can be requested at

    /tube?stop=$$$&line=@
    /tube?line=@&stop=$$$

where $$$ is the 3 letter station code and @ is the 1 letter line code
