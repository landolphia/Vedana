import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Jobs = new Mongo.Collection('jobs');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		//Jobs.remove({});
		//if (Jobs.find().count() === 0) {
		//	console.log("Inserting test jobs in DB.");
		//	var jobs = [];
		//	jobs = JSON.parse(Assets.getText("jobs.json"));
		//	jobs.forEach( function (j) {
		//		Jobs.insert(j);
		//	});
		//}

	});

	Meteor.publish('jobs', function jobsPublication(date) {
		check(date, Date);
		let range = Meteor.call('getWeekRange', date);
		range.owner = this.userId;
		return Jobs.find(range, { sort: { "date": 1}});
	});

	Meteor.methods({
		'jobs.total'(date) {
			date = new Date(date);
			check(date, Date);
			let range = Meteor.call('getWeekRange', date);
			range.owner = this.userId;
			let total = 0;
			let jobs = Jobs.find(range);
			jobs.forEach((job) => {
				total += Number(job.amount);
			});
			return total.toFixed(2);
		},
		'jobs.insert'(amount, mood, date) {
			if (! Meteor.userId()) {
				throw new Meteor.Error('not-authorized');
			}

			console.log("Inserting : " + amount + " + " + mood + " + " + date);
			date = new Date(date);
			check(date, Date);
			check(amount, Number);
			check(mood, Boolean);
			Jobs.insert({
				amount: amount.toFixed(2),
				mood: mood,
				date: date,
				owner: Meteor.userId(),
			});
		},
		'jobs.remove'(id) {
			if (! Meteor.userId()) {
				throw new Meteor.Error('not-authorized');
			}
			check(id, String);
			Jobs.remove(id);
		},
	});
}

