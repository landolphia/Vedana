import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Expenses } from '../imports/expenses.js';
import { Jobs } from '../imports/jobs.js';

export const Stats = new Mongo.Collection('stats');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		Stats.remove({});
		if (Stats.find().count() === 0) {
			console.log("Generating stats from Jobs and Expenses.");

			let jobs = Jobs.find({});
			let expenses = Expenses.find({});
			Stats.insert({ label: "Stats date range", amount: "TODO (7 days from Monday to Sunday, will use getRange from date utility.)"});

			Stats.insert({ label: "Total earned", amount: "TODO"});
			Stats.insert({ label: "Total earned before today", amount: "TODO"});
			Stats.insert({ label: "Today's earnings", amount: "TODO"});
			Stats.insert({ label: "Total spent", amount: "TODO"});

			Stats.insert({ label: "Number of jobs (weekly/daily)", amount: "TODO"});

			Stats.insert({ label: "Average earnings (including/excluding today)", amount: "TODO"});
			Stats.insert({ label: "Projections (left to reach goal, bonus if go on similarly, etc)", amount: "TODO"});
			Stats.insert({ label: "Ratio of mood (between 0 and 1)", amount: "TODO"});


			Stats.insert({ label: "Open days (passed/left/total)", amount: "TODO"});
			Stats.insert({ label: "Closed days (passed/left/total)", amount: "TODO"});

			Stats.insert({ label: "Week max daily amount", amount: "TODO"});
			Stats.insert({ label: "Week min daily amount", amount: "TODO (>0)"});

			Stats.insert({ label: "Needed for week", amount: "spent-earned IF > 0"});
			Stats.insert({ label: "Bonus for week", amount: "earned-spent IF > 0"});

			//	Meteor.call('jobs.total', {}, (err, res) => {
			//		if (err) {
			//			console.log("Error retrieving wages. " + err);
			//		} else {
			//			template.stats.set('jobsTotal', res);
			//			return res;
			//		}

			//	});
			//} else {
			//	return total;
			//}
		}

	});

	Meteor.publish('stats', function statsPublication() {
		return Stats.find();
	});
}

Meteor.methods({
	'stats'(){
		return Stats.find({});
	},
});
