import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  abbr: DS.attr(),
  category: DS.attr(),
  desc: DS.attr(),
  color: DS.attr(),

  songs: DS.hasMany()
});
