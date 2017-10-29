import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Expenses } from '../imports/expenses.js';
import { Jobs } from '../imports/jobs.js';
import { Stats } from '../imports/stats.js';

import '../imports/accounts-config.js';

import './main.html';


Template.body.onCreated( function bodyOnCreated() {
	Meteor.subscribe('expenses');
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
