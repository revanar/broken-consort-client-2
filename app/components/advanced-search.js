import Ember from 'ember';

export default Ember.Component.extend({
  selectedField: 'title',
  actions: {
    onSearch(obj){
      let output = {filter: {}};
      output.filter[obj.field] = [obj.title];
      this.get('onChange')(output);
    },
    addFilter(){
      //load new filter value into object expected by UpdateParams
      let output = {filter: {}};
      output.filter[this.selectedField] = [this.filter];
      //reset fields to defaults
      this.set('selectedField', 'title');
      this.set('filter','');
      //bubble up action
      this.get('onChange')(output);
    },
    deleteFilter(field, filter){
      //if there are no params, use an empty array. Probably not necessary, but better safe than sorry
      let param = Array.isArray(this.get('param')) ? {} : this.get('param');
      //remove filter from param[field]
      const index = param[field].indexOf(filter);
      param[field].splice(index, 1);
      //delete param[field] if there's nothing left in it
      if (param[field].length === 0){delete param[field];}
      //return in the format expected by UpdateParams
      this.get('onChange')({filter: param});
    }
  }
});
