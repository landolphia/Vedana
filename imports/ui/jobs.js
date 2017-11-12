import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import Jobs from '../api/jobs';

import './jobs.html';

Template.body.onCreated( function bodyOnCreated() {
	let now = new Date();
	Meteor.subscribe('jobs', now);
});

Template.body.helpers({
	jobs() {
		console.log("YOU)");
		return Jobs.find({});
	},
	jobs_total() {
		let template = Template.instance();
		let total = template.stats.get('jobsTotal');
		if ( total === undefined ) {
			let now = new Date();
			Meteor.call('jobs.total', now, (err, res) => {
				if (err) {
					console.log("Error retrieving wages. " + err);
				} else {
					template.stats.set('jobsTotal', res);
					return res;
				}

			});
		} else {
			return total;
		}
	},
});

Template.body.events({
	'submit #newJob'(event) {
		//FIXME this only prevents the first submit, weird
		//this does not seem to affect the expenses
		event.preventDefault();

		const target = event.target;
		const amount = target.amount.value;
		const mood = (event.currentTarget.id="happy");
		const now = new Date();
		target.amount.value = "";
		Meteor.call('jobs.insert', Number(amount), Boolean(mood), Date(now));
	},
	'click .deleteJob'(event) {
		event.preventDefault();
		Meteor.call('jobs.remove', this._id);
	},
});
