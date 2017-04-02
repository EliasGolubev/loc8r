var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/* Responce JSON  */
var sendJsonResponce = function(res, status, content){
  res.status(status);
  res.json(content);
};

var doSetAverageRating = function(location){
  var i, reviewCount, ratingAverage, ratingTotal;
  if(location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++){
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

var updateAverageRating = function(locationid){
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(function(err, location){
      if (!err) {
        doSetAverageRating(location);
      }
    });
};

var doAddReview = function(req, res, location){
  if(!location){
    console.log("locationid not found")
    sendJsonResponce(res, 404, {
      "message" : "locationid not found"
    });
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location){
      var thisReview;
      if(err){
        console.log(err);
        sendJsonResponce(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponce(res, 201, thisReview);
      }
    });
  }
};

module.exports.reviewsCreate = function(req, res){
  var locationid = req.params.locationid;
  if(locationid){
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function(err, location){
          if (err) {
            sendJsonResponce(res, 400, err);
          } else {
            doAddReview(req, res, location);
          }
        }
      );
  } else {
    sendJsonResponce(res, 404, {
      "message" : "Not found, locationid required"
    });
  }
};

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

module.exports.reviewsUpdateOne = function(req, res){
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponce(res, 404, {
      "message" : "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location){
      var thisReview;
      if (!location) {
        sendJsonResponce(res, 404, {
          "message" : "locationid not found"
        });
        return;
      } else if (err) {
        sendJsonResponce(res, 400, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          sendJsonResponce(res, 404, {
            "message" : "reviewid not found"
          });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function(err, location){
            if (err) {
              sendJsonResponce(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJsonResponce(res, 200, thisReview);
            }
          });
        }
      } else {
        sendJsonResponce(res, 404, {
          "message" : "No review to update"
        });
      }
    });
};

module.exports.reviewsDeleteOne = function(req, res){
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponce(res, 404, {
      "message" : "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location){
      if(!location){
        sendJsonResponce(res, 404, {
          "message" : "locationid not found"
        });
        return;
      } else if (err) {
        sendJsonResponce(res, 404, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        if (!location.reviews.id(req.body.reviewid)) {
          sendJsonResponce(res, 404, {
            "message" : "reviewid not found"
          });
        } else {
          location.reviews.id(req.params.reviewid).remove();
          location.save(function(err){
            if (err) {
              sendJsonResponce(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJsonResponce(res, 204, null);
            }
          });
        }
      } else {
        sendJsonResponce(res, 404, {
          "message" : "No review to delete"
        });
      }
    });
};
