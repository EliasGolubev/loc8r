var express = require('express');
var router = express.Router();

/* Require controllers */
var ctrlLocations = require('../controllers/locations');
var ctrlOther = require('../controllers/others');

/* Locations page */
router.get('/', ctrlLocations.homelists);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocations.addReview);
router.post('/location/:locationid/review/new', ctrlLocations.doAddReviews);

/* Other page */
router.get('/about', ctrlOther.about);

module.exports = router;
