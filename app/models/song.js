import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  parts_no: DS.attr(),
  voices: DS.attr(),
  composer: DS.attr(),
  song_no: DS.attr(),

  book: DS.belongsTo('book'),
  tags: DS.hasMany('tag')
});
