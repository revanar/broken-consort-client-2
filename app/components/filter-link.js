import Ember from 'ember';

const FilterLinkComponent = Ember.Component.extend({
});

FilterLinkComponent.reopenClass({
  positionalParams: ['param', 'field', 'data']
});

export default FilterLinkComponent;
