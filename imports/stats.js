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

			let totalEarnings = 0;
			let goodMood = 0;
			jobs.forEach((job) => {
				totalEarnings += job.amount;
				if (job.mood) goodMood++;
			});

			Stats.insert({ label: "Total earned", amount: totalEarnings});
			Stats.insert({ label: "Total # of jobs", amount: jobs.count()});
			Stats.insert({ label: "Ratio of mood (between 0 and 1)", amount: (goodMood / jobs.count()).toFixed(2)});

			let totalExpenses = 0;
			expenses.forEach((expense) => {
				totalExpenses += expense.amount;
			});
			Stats.insert({ label: "Total spent", amount: totalExpenses});

			let income = (totalEarnings - totalExpenses).toFixed(2);

			if (income < 0) {
				Stats.insert({ label: "Catchup", amount: -income});
				Stats.insert({ label: "Income", amount: 0});
			} else {
				Stats.insert({ label: "Catchup", amount: 0});
				Stats.insert({ label: "Net income", amount: income});
			}


			//TODO everything below
			Stats.insert({ label: "Stats date range", amount: "TODO (7 days from Monday to Sunday, will use getRange from date utility.)"});

			Stats.insert({ label: "Today's earnings", amount: "TODO"});
			Stats.insert({ label: "Total earned before today", amount: "TODO"});


			Stats.insert({ label: "Average earnings (including/excluding today)", amount: "TODO"});
			Stats.insert({ label: "Projections (left to reach goal, bonus if go on similarly, etc)", amount: "TODO"});


			Stats.insert({ label: "Open days (passed/left/total)", amount: "TODO"});
			Stats.insert({ label: "Closed days (passed/left/total)", amount: "TODO"});

			Stats.insert({ label: "Week max daily amount", amount: "TODO"});
			Stats.insert({ label: "Week min daily amount", amount: "TODO (>0)"});
		}

	});

	Meteor.publish('stats', function statsPublication() {
		return Stats.find();
	});
}
