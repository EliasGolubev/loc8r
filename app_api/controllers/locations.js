/* Responce JSON  */
var sendJsonResponce = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.locationsListByDistance = function(req, res){ 
  sendJsonResponce(res, 200, {"status" : "success"});
};

module.exports.locationsCreate= function(req, res){ /* . . . */ };
module.exports.locationsReadOne = function(req, res){ /* . . . */ };
module.exports.locationsUpdateOne = function(req, res){ /* . . . */ };
module.exports.locationsDeleteOne = function(req, res){ /* . . . */ };

