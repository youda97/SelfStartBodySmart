import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr(),
  size: DS.attr(),
  rawSize: DS.attr('number'),
  imageData: DS.attr(),
  exercise: DS.hasMany('exercise'),
  patient: DS.belongsTo('patient')
});
