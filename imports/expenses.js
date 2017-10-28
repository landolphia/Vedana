import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Expenses = new Mongo.Collection('expenses');

if (Meteor.isServer) {
	Meteor.startup(()=> {
		if (Expenses.find().count() === 0) {
			console.log("Populating DB with expenses.");

			Expenses.insert({ amount: 20, label: "chocolates"});
			Expenses.insert({ amount: 10, label: "the last of us"});
			Expenses.insert({ amount: 20, label: "mass effect"});
			Expenses.insert({ amount: 20, label: "mba charger"});
			Expenses.insert({ amount: 23, label: "fuddrucker's"});
			Expenses.insert({ amount: 45, label: "capris and coffee"});
			Expenses.insert({ amount: 10, label: "intermediary groceries"});
		}
	});

	Meteor.publish('expenses', function expensesPublication() {
		return Expenses.find();
	});
}

Meteor.methods({
  'expenses.insert'(amount, label) {
	  check(amount, Number);
	  check(label, String);

	  if (! Meteor.userId()) {
		  throw new Meteor.Error('not-authorized');
	  }
	  Expenses.insert({
		  amount: amount,
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
