import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Jobs = new Mongo.Collection('jobs');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		Jobs.remove({});
		if (Jobs.find().count() === 0) {
			console.log("Populating DB with jobs.");
			//Jobs.insert({ amount: 19.00, mood: true});
			//Jobs.insert({ amount: 15.67, mood: true});
			//Jobs.insert({ amount: 10.03, mood: true});
			//Jobs.insert({ amount: 37.21, mood: true});
			//Jobs.insert({ amount: 5.39, mood: true});
			//Jobs.insert({ amount: 6.92, mood: true});
			//Jobs.insert({ amount: 4.68, mood: true});
			//Jobs.insert({ amount: 39.88, mood: true});
			//Jobs.insert({ amount: 1.12, mood: true});
			//Jobs.insert({ amount: 4.53, mood: true});
			//Jobs.insert({ amount: 8.97, mood: true});
			//Jobs.insert({ amount: 1.15, mood: true});
			//Jobs.insert({ amount: 17.00, mood: true});
			//Jobs.insert({ amount: 1.74, mood: true});
			//Jobs.insert({ amount: 9.92, mood: true});
			//Jobs.insert({ amount: 73.32, mood: false});
			
			// 30/10
			Jobs.insert({ amount: 35.80, mood: true});
			// 31/10
			Jobs.insert({ amount: 33.66, mood: true});
			Jobs.insert({ amount: 24.76, mood: true});
			Jobs.insert({ amount: 1.88, mood: true});
			Jobs.insert({ amount: 23.27, mood: true});
			// 1/11
			Jobs.insert({ amount: 28.29, mood: true});
			// 2/11
			Jobs.insert({ amount: 32.44, mood: true});
			Jobs.insert({ amount: 0.45, mood: true});
			Jobs.insert({ amount: 18.62, mood: true});
			Jobs.insert({ amount: 1.14, mood: true});
			Jobs.insert({ amount: 2.52, mood: true});
			Jobs.insert({ amount: 8.84, mood: true});
		}

	});

	Meteor.publish('jobs', function jobsPublication() {
		return Jobs.find();
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
