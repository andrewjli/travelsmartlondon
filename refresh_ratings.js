var cleanUserRatings = {
    Piccadilly : null,
    District : null,
    Victoria : null,
    Circle : null,
    Hammersmith_and_City : null,
    Bakerloo : null,
    Waterloo_and_City : null, 
    Central : null,
    Jubilee : null,
    Metropolitan : null,
    Northern : null, 
    DLR : null,
    Overground : null
};

db.userRatings.update( {}, {'$set': cleanUserRatings}, false, true); 

var cleanOveralRatings = {
    0 : 0,
    1 : 0,
    2 : 0,
    3 : 0,
    4 : 0,
    5 : 0 
};

db.ratings.update( {}, {'$set': cleanOveralRatings}, false, true);