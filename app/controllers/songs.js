import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['sort', 'filter'],
  //must be a string formatted as "field_name" (for asc) or "field_name:desc" (for desc).
  sort: 'title',
  filter: [],

  testFilter: {filter:{'title':'Lachrimae Antiquae', 'book.title':'Lachrimae'}},

  //filter model based on the value of the filter parameter
  filteredModel: Ember.computed('{model,filter}', function(){
    const filter = this.get('filter');
    let model = this.get('model').toArray();
    //for each field provided in the filter, returns anything that exactly matches the filter terms
    for (const key in filter){
      if (!filter.hasOwnProperty(key)) {continue;}
      //for numeric data, allow range searches with "-" separator
      if ((key === 'book.year' || key === 'song_no' || key === 'parts_no') && filter[key].indexOf('-') > -1){
        const [startDate, endDate] = filter[key].split('-');
        model = model.filter(item => item.get(key) >= startDate && item.get(key) <= endDate);
        //for tags, filter by tag titles - only filters by one tag at a time
      } else if (key=== 'languages' || key === 'tags'){
        model = model.filter(
          model => {return (model.get('tags').filter(item => {return item.get('title') === filter[key]}).length > 0)}
        )
      }
      else {
        model = model.filterBy(key, filter[key]);
      }
    }
    return model;
  }),

  //converts sort parameter into format expected by Ember.computed.sort
  sortArray: Ember.computed('sort', function(){return [this.get('sort')];}),
  //sorts model based on the value of the sort parameter
  sortedModel: Ember.computed.sort('filteredModel', 'sortArray'),

  //not currently being used.
  actions: {
    updateParams(obj){
      for (const key in obj){
        if (!obj.hasOwnProperty(key)) {continue;}
        this.set(key, obj[key]);
        this.notifyPropertyChange(key);
      }
    }
  }

});
