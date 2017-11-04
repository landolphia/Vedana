import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Jobs = new Mongo.Collection('jobs');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		Jobs.remove({});
		if (Jobs.find().count() === 0) {
			console.log("Inserting test jobs in DB.");
			var jobs = [];
			jobs = JSON.parse(Assets.getText("jobs.json"));
			jobs.forEach( function (j) {
				Jobs.insert(j);
			});
		}

	});

	Meteor.publish('jobs', function jobsPublication() {
		return Jobs.find({}, { sort: { "date": 1}});
	});
}

Meteor.methods({
	'jobs.total'(){
		let total = 0;
		let jobs = Jobs.find({});
		jobs.forEach((job) => {
			total += job.amount;
		});
		return total.toFixed(2);
	},
	'jobs.insert'(amount, mood) {
		check(amount, Number);
		check(mood, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		Jobs.insert({
			amount: amount.toFixed(2),
			mood: mood,
			createdAt: new Date(),
			owner: Meteor.userId(),
		});
	},
	'jobs.remove'(id) {
		check(id, String);
		Jobs.remove(id);
	},
});
