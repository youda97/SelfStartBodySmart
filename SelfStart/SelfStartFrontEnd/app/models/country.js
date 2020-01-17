import DS from 'ember-data';

export default DS.Model.extend({
  // country
  name: DS.attr(),
  provinces: DS.hasMany('province'), //1 to many
});
