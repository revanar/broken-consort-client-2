import Ember from 'ember';

export default Ember.Component.extend({
  selectedField: 'title',
  paramIsEmpty: Ember.computed('param', function(){
    return Object.getOwnPropertyNames(this.get('param')).length === 0 || this.get('param').length === 0;
  }),
  actions: {
    onSearch(obj){
      let param = Array.isArray(this.get('param')) ? {} : this.get('param');
      if(param[obj.field]){
        param[obj.field].push(obj.title);
      } else {
        param[obj.field] = [obj.title];
      }
      this.set('beep', '');
      this.get('onChange')({filter: param});
    },
    addFilter(){
      //load new filter value into object expected by UpdateParams
      let param = Array.isArray(this.get('param')) ? {} : this.get('param');
      if(param[this.selectedField]){
        param[this.selectedField].push(this.filter);
      } else {
        param[this.selectedField] = [this.filter];
      }
      //reset fields to defaults
      this.set('selectedField', 'title');
      this.set('filter','');
      //bubble up action
      this.get('onChange')({filter: param});
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
    },
    clearFilters(){
      this.get('onChange')({filter: {}});
    }
  }
});
