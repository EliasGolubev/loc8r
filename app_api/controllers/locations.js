/* Responce JSON  */
var sendJsonResponce = function(res, status, content){
  res.status(status);
  res.json(content);
};

var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
module.exports.locationsListByDistance = function(req, res){ 
  sendJsonResponce(res, 200, {"status" : "success"});
};

var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
module.exports.locationsCreate= function(req, res){ /* . . . */ };

var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
module.exports.locationsReadOne = function(req, res){ /* . . . */ };

var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
module.exports.locationsUpdateOne = function(req, res){ /* . . . */ };

var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
module.exports.locationsDeleteOne = function(req, res){ /* . . . */ };

