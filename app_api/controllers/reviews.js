/* Responce JSON  */
var sendJsonResponce = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.reviewsCreate = function(req, res){ /* . . . */};
module.exports.reviewsReadOne = function(req, res){ /* . . . */ };
module.exports.reviewsUpdateOne = function(req, res){ /* . . . */ };
module.exports.reviewsDeleteOne = function(req, res){ /* . . . */};