import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import Expenses from '../api/expense'

import './expenses.html';

Template.body.onCreated( function bodyOnCreated() {
	let now = new Date();
	Meteor.subscribe('expenses', now);
});

Template.body.helpers({
	expenses() {
		return Expenses.find({});
	},
	expenses_total() {
		let template = Template.instance();
		let total = template.stats.get('expensesTotal');
		if ( total === undefined ) {
			let now = new Date();
			Meteor.call('expenses.total', now, (err, res) => {
				if (err) {
					console.log("Error retrieving expenses. " + err);
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
