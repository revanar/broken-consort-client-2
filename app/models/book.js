import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  year: DS.attr('string'),
  editor: DS.attr(),

  songs: DS.hasMany()
});
