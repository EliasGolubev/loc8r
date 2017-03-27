/* GET home page */
module.exports.homelists = function(req, res){
  res.render('locations-list', { title: 'Home' });
};
/* GET informations page */
module.exports.locationInfo = function(req, res){
  res.render('location-info', { title: 'Location info' });
};
/* GET review page */
module.exports.addReview = function(req, res){
  res.render('location-review-form', { title: 'Add review' });
};