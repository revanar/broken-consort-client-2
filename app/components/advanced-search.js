import Ember from 'ember';

export default Ember.Component.extend({
  selectedField: 'title',
  actions: {
    onSearch(obj){
      let output = {filter: {}};
      output.filter[obj.field] = obj.title;
      this.get('onChange')(output);
    },
    addFilter(){
      let output = {filter: {}};
      output.filter[this.selectedField] = this.filter;
      this.get('onChange')(output);
    },
    deleteFilter(){
      let output = {filter: {}};
      this.get('onChange')(output);
    }
  }
});
