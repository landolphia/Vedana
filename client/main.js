import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Expenses } from '../imports/expenses.js';
import { Jobs } from '../imports/jobs.js';
import { Stats } from '../imports/stats.js';

import '../imports/accounts-config.js';

import './main.html';


Template.body.onCreated( function bodyOnCreated() {
	let now = new Date();
	Meteor.subscribe('expenses', now);
	Meteor.subscribe('jobs');
	Meteor.subscribe('stats');

	this.stats = new ReactiveDict("stats");
});

Template.body.helpers({
	stats() {
		return Stats.find({});
	},
	jobs() {
		return Jobs.find({});
	},
	jobs_total() {
		let template = Template.instance();
		let total = template.stats.get('jobsTotal');
		if ( total === undefined ) {
			Meteor.call('jobs.total', {}, (err, res) => {
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
	expenses() {
		return Expenses.find({});
	},
	expenses_total() {
		let template = Template.instance();
		let total = template.stats.get('expensesTotal');
		if ( total === undefined ) {
			Meteor.call('expenses.total', {}, (err, res) => {
				if (err) {
					console.log("Error retrieving wages. " + err);
				} else {
					template.stats.set('expensesTotal', res);
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
		target.amount.value = "";
		const mood = (event.currentTarget.id="happy");
		Meteor.call('jobs.insert', Number(amount), Boolean(mood));
	},
	'click .deleteJob'(event) {
		event.preventDefault();
		Meteor.call('jobs.remove', this._id);
	},
	'submit #newExpense'(event) {
		event.preventDefault();

		const target = event.target;
		const amount = target.amount.value;
		const label = target.label.value;
		const now = new Date();
		target.amount.value = "";
		target.label.value = "";
		Meteor.call('expenses.insert', Number(amount), String(label), Date(now));
	},
	'click .deleteExpense'(event) {
		event.preventDefault();
		Meteor.call('expenses.remove', this._id);
	},
});
