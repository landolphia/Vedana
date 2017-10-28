import { Template } from 'meteor/templating';
import { Expenses } from '../imports/expenses.js';
import { Jobs } from '../imports/jobs.js';

import '../imports/accounts-config.js';

import './main.html';


Template.body.onCreated( function bodyOnCreated() {
	Meteor.subscribe('expenses');
	Meteor.subscribe('jobs');
});

Template.body.helpers({
	jobs() {
		return Jobs.find({});
	},
	jobs_total() {
		return (10+20+20+23+45+10);
	},
	expenses() {
		return Expenses.find({});
	},
	expenses_total() {
		return (20+10+20+20+23+45+10);
	},
});
