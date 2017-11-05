import '../imports/expenses.js';
import '../imports/jobs.js';
import '../imports/stats.js';

import '../imports/dates.js';
let now = new Date();
Meteor.call('getToday', now);
Meteor.call('getWeekRange', now, function (err, res) {
	if (err) {
		console.log("Error retrieving week range.");
	} else {
		console.log("Week range = " + JSON.stringify(res));
	};
});
