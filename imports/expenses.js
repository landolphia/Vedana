import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Expenses = new Mongo.Collection('expenses');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		Expenses.remove({});
		if (Expenses.find().count() === 0) {
			console.log("Inserting test expenses in DB.");
			var expenses = [];
			expenses = JSON.parse(Assets.getText("expenses.json"));
			expenses.forEach( function (e) {
				Expenses.insert(e);
			});
		}
	});

	Meteor.publish('expenses', function expensesPublication() {
		return Expenses.find({}, { sort: { "date": 1}});
	});
}

Meteor.methods({
	'expenses.total'(){
		let total = 0;
		let expenses = Expenses.find({});
		expenses.forEach((expense) => {
			total += expense.amount;
		});
		return total.toFixed(2);
	},
	'expenses.insert'(amount, label) {
		check(amount, Number);
		check(label, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		Expenses.insert({
			amount: amount.toFixed(2),
			label: label,
			createdAt: new Date(),
			owner: Meteor.userId(),
		});
	},
	'expenses.remove'(id) {
		check(id, String);
		Expenses.remove(id);
	},
});
