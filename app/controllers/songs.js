import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['sort', 'filter'],
  //must be a string formatted as "field_name" (for asc) or "field_name:desc" (for desc).
  sort: 'title',
  filter: [],

  fieldLabels: {
    //uses "--" instead of "." to allow it to work correctly with the get helper, to dynamically generate labels in the template
    title: "Song Title",
    parts_no: "Number of Parts",
    voices: "Voices",
    composer: "Composer",
    "book--title": "Book Title",
    "book--editor": "Book Editor",
    "book--year": "Book Publication Year",
    languages: "Language",
    tags: "Tag"
  },

  //creates an array of objects representing each unique searchable value, to be used by the ui-search component
  searchPool: Ember.computed('{model,fieldLabels}', function(){
    let pool = new Set();
    const model = this.get('model');
    const labels = this.get('fieldLabels');
    // iterate through songs, books, and tags and pull unique values
    model.forEach(function(item){
      const songs = item.data;
      const books = item.get('book.data');
      const tags = item.get('tags');
      for (const key in songs){
        if (songs[key]){
          pool.add(`${key}::${songs[key]}`);
        }
      }
      for (const key in books){
        if (books[key]){
          pool.add(`book--${key}::${books[key]}`)
        }
      }
      tags.forEach(function(tag){
        if (tag.get('title')){
          pool.add(`${tag.get('category')}s::${tag.get('title')}`)
        }
      });
    });
    //convert set into object
    let output = [];
    pool.forEach(function(item){
      const [field, title] = item.split("::");
      output.push({title:title, description:labels[field], field:field});
    });
    //sort output array by title
    function compare(a,b){
      if (a.title < b.title){
        return -1;
      }
      if (a.title > b.title){
        return 1;
      }
      return 0;
    }
    output.sort(compare);
    return output;
  }),

  //filter model based on the value of the filter parameter
  filteredModel: Ember.computed('{model,filter}', function(){
    const filter = this.get('filter');
    let model = this.get('model').toArray();
    //for each field provided in the filter, returns anything that exactly matches the filter terms
    for (const key in filter){
      if (!filter.hasOwnProperty(key)) {continue;}
      //regex allows for "includes" testing for partial matching, and also ignores illegal characters
      const regex = new RegExp(filter[key].replace(/[{}"()]/g, ""), 'i');
      //modelKey replaces "--" in the filter keys with ".", so that it searches model relationships correctly
      const modelKey = key.replace("--", ".");
      //for numeric data, allow range searches with "-" separator
      if ((key === 'book--year' || key === 'song_no' || key === 'parts_no') && filter[key].indexOf('-') > -1){
        const [startDate, endDate] = filter[key].split('-');
        model = model.filter(item => item.get(modelKey) >= startDate && item.get(modelKey) <= endDate);
        //for tags, filter by tag titles - only filters by one tag at a time
      } else if (key=== 'languages' || key === 'tags'){
        const regex = new RegExp(filter[key], 'i');
        model = model.filter(
          model => {return (model.get('tags').filter(item => {return regex.test(item.get('title'))}).length > 0)}
        )
      }
      else {
        model = model.filter(item => {return regex.test(item.get(modelKey))});
      }
    }
    return model;
  }),

  //converts sort parameter into format expected by Ember.computed.sort
  sortArray: Ember.computed('sort', function(){return [this.get('sort')];}),
  //sorts model based on the value of the sort parameter
  sortedModel: Ember.computed.sort('filteredModel', 'sortArray'),

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
