import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['sort', 'filter'],
  //must be a string formatted as "field_name" (for asc) or "field_name:desc" (for desc).
  sort: 'title',
  filter: [],

  //creates an array of objects representing each unique searchable value, to be used by the ui-search component
  searchPool: Ember.computed('model', function(){
    let pool = new Set();
    const model = this.get('model');
    const labels = {
      title: "Song Title",
      parts_no: "Number of Parts",
      voices: "Voices",
      composer: "Composer",
      "book.title": "Book Title",
      "book.editor": "Book Editor",
      "book.year": "Book Publication Year",
      languages: "Language",
      tags: "Tag"
    };
    //iterate through songs, books, and tags and pull unique values
    model.forEach(function(item){
      const songs = item.data;
      const books = item.get('book.data');
      const tags = item.get('tags');
      for (const key in songs){
        if (!(!songs[key])){
          pool.add(`${key}::${songs[key]}`);
        }
      }
      for (const key in books){
        if (!(!books[key])){
          pool.add(`book.${key}::${books[key]}`)
        }
      }
      tags.forEach(function(tag){
        if (!(!tag.get('title'))){
          pool.add(`${tag.get('category')}s::${tag.get('title')}`)
        }
      });
    });
    //convert set into object
    let output = [];
    pool.forEach(function(item){
      const itemArray = item.split("::");
      const title = itemArray[1];
      const description = itemArray[0];
      output.push({title:title, description:labels[description], field:description});
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
      console.log(obj);
      for (const key in obj){
        if (!obj.hasOwnProperty(key)) {continue;}
        this.set(key, obj[key]);
        this.notifyPropertyChange(key);
      }
    },
    applyFilter(obj){
      console.log(obj);
      let output = {filter: {}};
      output.filter[obj.field] = obj.title;
      this.send('updateParams', output);
    }
  }

});
