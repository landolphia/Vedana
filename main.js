Days = new Mongo.Collection("days");

if (Meteor.isServer && Meteor.isDevelopment) {
	Meteor.methods({
		'initDB'({offset}) {
			let date = new Date();
			let localoffset = date.getTimezoneOffset();
			let finaloffset = offset - localoffset;
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			date = moment(date).add(finaloffset, 'minutes').toDate();

			Days.remove({});//"owner": this.userId});

			let weekday = moment(date).isoWeekday() - 1;
			let mon = moment(date).subtract(weekday, 'days');
			let tuesday = moment(mon).add(1, 'days');
			let wednesday = moment(mon).add(2, 'days');
			let thursday = moment(mon).add(3, 'days');
			let friday = moment(mon).add(4, 'days');
			let saturday = moment(mon).add(5, 'days');
			let sun = moment(mon).add(6, 'days');
			let range = {"date" : {$gte : mon.toDate(), $lte : sun.toDate()}};//, "owner": this.userId};

			if (Days.find(range).count() != 7) {
				let anchor = new moment("2017-10-23", "YYYY-MM-DD");

				// 10/23/15 ->
				Days.insert({date: anchor.toDate(), amount: 44.70, dayoff: false, owner: this.userId});
				Days.insert({date: anchor.add(1, 'days').toDate(), amount: 54.20, dayoff: false, owner: this.userId});
				Days.insert({date: anchor.add(1, 'days').toDate(), amount: 54.5, dayoff: false, owner: this.userId});
				Days.insert({date: anchor.add(1, 'days').toDate(), amount: 1.15, dayoff: false, owner: this.userId});
				Days.insert({date: anchor.add(1, 'days').toDate(), amount: 0, dayoff: false, owner: this.userId});
				Days.insert({date: anchor.add(1, 'days').toDate(), amount: 0, dayoff: true, owner: this.userId});
				Days.insert({date: anchor.add(1, 'days').toDate(), amount: 0, dayoff: true, owner: this.userId});
			}

			console.log("Today is " + date);
			console.log("Day offset = " + weekday);
			console.log("This week's range is " + mon.calendar() + " to " + sun.calendar());

			let total = 0;
			Days.find(range, {sort : {date: 1}}).forEach(function (day) {
				if (day.amount) total+=day.amount;
				console.log("Day: " + day.date + " + " + day.amount + " / " + day.dayoff);
			});
			console.log("Weekly total: " + total);
		},
	});
}
//
//
//	console.log("[Publish] -> days for " + date);
//	console.log("Dayoffset = " + weekday);
//	console.log("Today is " + date);
//	console.log("This week's range is " + mon.calendar() + " to " + sun.calendar());
//
//	let range = {"date" : {$gte : mon.toDate(), $lte : sun.toDate()}, "owner": this.userId};
//	let total = 0;
//	Days.find(range, {sort : {date: 1}}).forEach(function (day) {
//		if (day.amount) total+=day.amount;
//		console.log("Day: " + day.date + " + " + day.amount + " / " + day.dayoff);
//	});
//	console.log("Weekly total: " + total);
//
//
//
//
//	let currentYear = moment(today).year();
//	let currentMonth = moment(today).month();
//
//	let firstOfMonth = moment(currentYear + "-" + (currentMonth+1) + "-01", "YYYY-MM-DD");
//
//	let firstOfNextMonth = new moment(firstOfMonth);
//	firstOfNextMonth.add(1, 'months');
//	console.log("First of this month: " + firstOfMonth.format("dddd, MMMM Do YYYY, h:mm:ss a"));
//	console.log("First of next month: " + firstOfNextMonth.format("dddd, MMMM Do YYYY, h:mm:ss a"));
//
//	let range = {"date" : {$gte : firstOfMonth.toDate(), $lt : firstOfNextMonth.toDate()}, "owner": this.userId};
//
//	let total = 0;
//	Days.find(range, {sort : {date: 1}}).forEach(function (day) {
//		if (day.amount) total+=day.amount;
//		//console.log("Day: " + day.date + " + " + day.amount + " / " + day.dayoff);
//	});
//	console.log("This month's total: " + total);
//
//	return Days.find(range, {sort: {date: 1}});
//});
//}
//
//
if  (Meteor.isClient && Meteor.isDevelopment) {
	let today = new Date();
	let todayM = moment(today);
	console.log("Application started. " + todayM.calendar() + ".");
	Meteor.call("initDB", { 'offset': today.getTimezoneOffset()});
}
