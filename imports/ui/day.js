import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Jobs } from '../api/jobs';

import './day.html';

Template.body.onCreated( function bodyOnCreated() {
	let now = new Date();
	Meteor.subscribe('jobs', now);
});

Template.body.helpers({
	dayName() {
		return "Monday";
	},
	dayTotal() {
		return "TODO";
	},
	todaysJobs() {
		return  Jobs.find();
	}
});

Template.newJobForm.events({
	'submit'(e) {
		e.preventDefault();
		const amount = e.target.amount.value;
		const now = new Date();
		e.target.amount.value = "";
		Meteor.call('jobs.insert', Number(amount), Date(now));
	},
});

Template.job.events({
	'click .deleteJob'(event) {
		event.preventDefault();
		Meteor.call('jobs.remove', this._id);
	},
});
