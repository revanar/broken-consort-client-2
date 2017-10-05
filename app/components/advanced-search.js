import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    applyFilter(obj){
      let output = {filter: {}};
      output.filter[obj.field] = obj.title;
      this.get('onChange')(output);
    },
    testAction(){
      let output = {filter: {}};
      output.filter[this.selectedField] = this.filter;
      this.get('onChange')(output);
    }
  }
});
