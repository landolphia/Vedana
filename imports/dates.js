Meteor.methods({
	'getToday'({date}) {
		let today = moment(date).utcOffset(0).set({hour:0, minute:0, second:0, millisecond: 0}).format();

		console.log("Today is " + today + " for the client.");
	},
	'getWeekRange'(date) {
		let today = moment(date).utcOffset(0).set({hour:0, minute:0, second:0, millisecond: 0}).format();

		let remoteDate = moment(date);
		let remoteOffset = remoteDate.utcOffset();

		let weekday = moment(today).isoWeekday() - 1;
		let monday = moment(today).subtract(weekday, 'days').utcOffset(0);
		let sunday = moment(monday).add(6, 'days').utcOffset(0);

		let range = {"date" : {$gt : monday.toDate(), $lte : sunday.toDate()}};

		return range;
	}
});
