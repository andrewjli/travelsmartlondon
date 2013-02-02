# TravelSmart London 2.0 #
Server-side program for the TravelSmart London platform.

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

    /bus?stopcode1=#####'

where ##### is the 5 digit bus stop code  

### Tube Countdown ###
Tube countdown can be requested at

    /tube?stop=$$$&line=@
    /tube?line=@&stop=$$$

where $$$ is the 3 letter station code and @ is the 1 letter line code

### Bike Dock Status ###
Bike dock status/availability can be requested at

    /bike  

There is no filtering available yet.

### Tube Line Status ###
Tube line status can be requested at

    /lines

There is no filtering available.

### Crowdedness ###
Crowdedness index can be requested at

    /crowd
    /crowd2

This feature is still under testing and may not work at all
