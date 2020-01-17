import DS from 'ember-data';

export default DS.Model.extend({
  order: DS.attr('Number'),
  exercise: DS.belongsTo('exercise'),
  rehabilitationPlan: DS.belongsTo('rehabilitationplan'),
});
