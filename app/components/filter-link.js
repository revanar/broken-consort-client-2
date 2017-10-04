import Ember from 'ember';

const FilterLinkComponent = Ember.Component.extend({
  tagName: '',
  isFiltered: false,
  toggleFilter: {},

  didReceiveAttrs: function () {
    this._super(...arguments);
    let newParams = Array.isArray(this.get('param')) ? {} : this.get('param');
    const field = this.get('field');
    const data = this.get('data');
    if (this.get('field') in this.get('param')) {
      this.set('isFiltered', true);
      delete newParams[field];

    } else {
      newParams[field] = data;
    }
    this.set('toggleFilter', newParams);
  }
});

FilterLinkComponent.reopenClass({
  positionalParams: ['param', 'field', 'data']
});

export default FilterLinkComponent;
