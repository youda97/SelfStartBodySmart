import DS from 'ember-data';

export default DS.Model.extend({
  // province
  name: DS.attr(),
  country: DS.belongsTo('country',{ async: true }), //1 to 1
  cities: DS.hasMany('city',{ async: true }), //1 to many
});
