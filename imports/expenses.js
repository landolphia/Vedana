import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { getWeekRange } from './dates.js';

export const Expenses = new Mongo.Collection('expenses');

if (Meteor.isServer) {
	Meteor.startup(()=> {
//		Expenses.remove({});
//		if (Expenses.find().count() === 0) {
//			console.log("Inserting test expenses in DB.");
//			var expenses = [];
//			expenses = JSON.parse(Assets.getText("expenses.json"));
//			expenses.forEach( function (e) {
//				Expenses.insert(e);
//			});
//		}
	});

	Meteor.publish('expenses', function expensesPublication(date) {
		check(date, Date);
		let range = Meteor.call('getWeekRange', date);
		range.owner = this.userId;
		return Expenses.find(range, { sort: { "date": 1}});
	});
}

Meteor.methods({
	'expenses.total'(date) {
		date = new Date(date);
		check(date, Date);
		let range = Meteor.call('getWeekRange', date);
		range.owner = this.userId;
		let total = 0;
		let expenses = Expenses.find(range);
		expenses.forEach((expense) => {
			total += Number(expense.amount);
		});
		return total.toFixed(2);
	},
	'expenses.insert'(amount, label, date) {
		console.log("Inserting : " + amount + " + " + label + " + " + date);
		date = new Date(date);
		check(amount, Number);
		check(label, String);
		check(date, Date);

		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		Expenses.insert({
			amount: amount.toFixed(2),
			label: label,
			date: date,
			owner: Meteor.userId(),
		});
	},
	'expenses.remove'(id) {
		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		check(id, String);
		Expenses.remove(id);
	},
});
