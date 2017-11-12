import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { getWeekRange } from './dates.js';

import { Expenses } from './expenses.js';
import { Jobs } from './jobs.js';

export const Stats = new Mongo.Collection('stats');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		Stats.remove({});
		if (Stats.find().count() === 0) {
			let now = new Date();
			let range = Meteor.call('getWeekRange', now);
			console.log("Generating stats from Jobs and Expenses.");

			console.log("With this range : " + JSON.stringify(range));
			let jobs = Jobs.find(range);
			let expenses = Expenses.find(range);

			let totalEarnings = 0;
			let goodMood = 0;
			jobs.forEach((job) => {
				totalEarnings += Number(job.amount);
				if (job.mood) goodMood++;
			});

			Stats.insert({ label: "Total income", amount: totalEarnings});
			Stats.insert({ label: "# of jobs", amount: jobs.count()});
			Stats.insert({ label: "Mood ratio", amount: (goodMood / jobs.count()).toFixed(2)});

			let totalExpenses = 0;
			expenses.forEach((expense) => {
				totalExpenses += Number(expense.amount);
			});
			Stats.insert({ label: "Total expenditure", amount: totalExpenses});

			let net= (totalEarnings - totalExpenses).toFixed(2);
			Stats.insert({ label: "Net", amount: net});

			Stats.insert({ label: "This week", amount: JSON.stringify(range)});

			//TODO everything below
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
