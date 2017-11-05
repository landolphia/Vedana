Meteor.methods({
	'getToday'({date}) {
		console.log("Calling getToday");
		let today = moment().utcOffset(0).set({hour:0, minute:0, second:0, millisecond: 0}).format();

		let remoteDate = moment(date);
		let remoteOffset = remoteDate.utcOffset();

		let weekday = moment(today).isoWeekday();
		let monday = moment(today).subtract(weekday, 'days').utcOffset(0);
		let sunday = moment(monday).add(6, 'days').utcOffset(0);

		console.log("Today is " + today);
		console.log("This week's range is " + monday.calendar() + " to " + sunday.calendar());

		console.log("remote date: " + remoteDate.format());
		console.log("This is today : " + today);
	},
	'getWeekRange'({date}) {
		console.log("Calling getWeekRange");
		let today = moment().utcOffset(0).set({hour:0, minute:0, second:0, millisecond: 0}).format();

		let remoteDate = moment(date);
		let remoteOffset = remoteDate.utcOffset();

		let weekday = moment(today).isoWeekday();
		let monday = moment(today).subtract(weekday, 'days').utcOffset(0);
		let sunday = moment(monday).add(6, 'days').utcOffset(0);

		let range = {"date" : {$gt : monday.toDate(), $lte : sunday.toDate()}};//, "owner": Meteor.user()._id};

		console.log("Range = " + JSON.stringify(range));	
		return range;
	}
});
