import { Template } from 'meteor/templating';
import { Expenses } from '../imports/expenses.js';

import '../imports/accounts-config.js';

import './main.html';


Template.body.onCreated( function bodyOnCreated() {
	Meteor.subscribe('expenses');
});

Template.body.helpers({
	expenses() {
		return Expenses.find({});
	},
	expenses_total() {
		return (20+10+20+20+23+45+10);
	},
});
