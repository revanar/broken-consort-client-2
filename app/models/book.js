import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  year: DS.attr(),
  editor: DS.attr(),

  songs: DS.hasMany()
});
