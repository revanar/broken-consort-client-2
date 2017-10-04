import Ember from 'ember';

const FilterLinkComponent = Ember.Component.extend({
  tagName: '',
  isFiltered: Ember.computed('{param,field}', function(){
    return this.get('field') in this.get('param');
  }),
  toggleFilter: Ember.computed('{param,field,data,isFiltered}', function(){
    const beep = this.get('param');
    const field = this.get('field');
    const data = this.get('data');
    if (this.get('isFiltered')){
      let result = delete beep[field];
      return result;
    } else {
      beep[field] = data;
      return beep;
    }
  })
});

FilterLinkComponent.reopenClass({
  positionalParams: ['param', 'field', 'data']
});

export default FilterLinkComponent;
