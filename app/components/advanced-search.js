import Ember from 'ember';

export default Ember.Component.extend({
  groupedFilters: {},
  didReceiveAttrs(){
    this._super(...arguments);
    this.send('setGroupedFilters')
  },
  actions: {
    applyFilter(obj){
      let output = {filter: {}};
      output.filter[obj.field] = obj.title;
      this.get('onChange')(output);
    },
    setGroupedFilters(){
      const pool = this.get('pool');
      console.log(pool);
    }
  }
});
