var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/* Responce JSON */
var sendJsonResponce = function(res, status, content){
  res.status(status);
  res.json(content);
};

var theEarth = (function(){
  var earthRadius = 6371;

  var getDistanceFromRads = function(rads){
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance){
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  };
})();

/* GET#index list of location */
module.exports.locationsListByDistance = function(req, res){ 
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type:         "Point",
    coordinates:  [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  if (!lng || !lat){
    sendJsonResponce(res, 404, {
      "message" : "lng and lat query parameters are required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions,
    function(err, results, status){
      var locations = [];
      if (err){
        sendJsonResponce(res, 404, err);
      } else {
        results.forEach(function(doc){
          locations.push({
            distance: theEarth.getDistanceFromRads(doc.dis),
            name: doc.obj.name,
            address: doc.obj.address,
            rating: doc.obj.rating,
            facilities: doc.obj.facilities,
            _id: doc.obj._id
          });
        });
        sendJsonResponce(res, 200, locations);
      }
    });
};

/* POST#create a new location */
module.exports.locationsCreate= function(req, res){
  console.log(req.body);
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coordinates: [parseFloat(req.body.lng),
                  parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location){
    if (err) {
      console.log(err);
      sendJsonResponce(res, 400, err);
    } else {
      console.log(location);
      sendJsonResponce(res, 201, location);
    }
  });
};

/* GET#location by the id */
module.exports.locationsReadOne = function(req, res){
  console.log("Finding location details ", req.params);
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location){ 
        if(!location){
          sendJsonResponce(res, 404, {
            "message" : "locationid not found"
          });
          return;
        } else if(err){
          console.log(err);
          sendJsonResponce(res, 404, err);
          return;
        }
        sendJsonResponce(res, 200, location);
      });
  } else {
    console.log("No locationid in request");
    sendJsonResponce(res, 404, {
      "message" : "No locationid in request"
    });
  }
};

module.exports.locationsUpdateOne = function(req, res){
  if (!req.params.locationid) {
    sendJsonResponce(res, 404, {
      "message" : "Not found, locationid is required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select("-reviews -rating")
    .exec(function(err, location){
      if (!location) {
        sendJsonResponce(res, 404, {
          "message" : "locationid not found"
        });
        return;
      } else if (err) {
        sendJsonResponce(res, 400, err);
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      }, {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }];
      location.save(function(err, location){
        if(err){
          console.log(err);
          sendJsonResponce(res, 404, err);
        } else {
          sendJsonResponce(res, 200, location);
        }
      });
    });
};

module.exports.locationsDeleteOne = function(req, res){
  var locationid = req.params.locationid;
  if (locationid) {
    Loc 
      .findByIdAndRemove(locationid)
      .exec(function(err, location){
        if (err) {
          sendJsonResponce(res, 404, err);
          return;
        }
        sendJsonResponce(res, 204, null);
      });
  } else {
    sendJsonResponce(res, 404, {
      "message" : "No locationid"
    });
  }
};
