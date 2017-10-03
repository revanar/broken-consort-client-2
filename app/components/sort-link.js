import Ember from 'ember';

const SortLinkComponent = Ember.Component.extend({
});

SortLinkComponent.reopenClass({
  positionalParams: ['param', 'field']
});

export default SortLinkComponent;
