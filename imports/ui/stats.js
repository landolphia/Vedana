import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { ReactiveDict } from 'meteor/reactive-dict';

import Stats from '../api/stats';

import './stats.html';

Template.body.onCreated( function bodyOnCreated() {
	let now = new Date();
	Meteor.subscribe('stats', now);

	this.stats = new ReactiveDict("stats");
});

Template.body.helpers({
	stats() {
		return Stats.find();
	},
});
