/* Responce JSON  */
var sendJsonResponce = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.reviewsCreate = function(req, res){/* . . . */};

var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
module.exports.reviewsReadOne = function(req, res){ 
  if (req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location){
          var responce, review;
          if (!location) {
            sendJsonResponce(res, 404, {
              "message" : "locationid not found"
            });
            return;
          } else if (err) {
            sendJsonResponce(res, 400, err);
            return;
          }

          if (location.reviews && location.reviews.length > 0){
            review = location.reviews.id(req.params.reviewid);
            
            if (!review){
              sendJsonResponce(res, 404, {
                "message" : "reviewid not found"
              });
            } else {
              responce = {
                location : {
                  name : location.name,
                  id: req.params.locationid
                },
                review : review
              };
              sendJsonResponce(res, 200, responce);
            }
          } else {
            sendJsonResponce(res, 404, {
              "message" : "No reviews found"
            });
          }
        }
      );
  } else {
    sendJsonResponce(res, 404, {
      "message" : "Not found, locationid and reviewid are both required"
    });
  }
};

module.exports.reviewsUpdateOne = function(req, res){ /* . . . */ };

module.exports.reviewsDeleteOne = function(req, res){ /* . . . */};