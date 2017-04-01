var express = require('express');
var router = express.Router();

/* Require controllers */
var ctrlLocations = require('../controllers/locations');
var ctrlOther = require('../controllers/others');

/* Locations page */
router.get('/', ctrlLocations.homelists);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Other page */
router.get('/about', ctrlOther.about);

module.exports = router;
