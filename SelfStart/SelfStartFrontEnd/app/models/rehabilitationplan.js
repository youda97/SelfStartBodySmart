import DS from 'ember-data';

export default DS.Model.extend({
  planName: DS.attr(),
  description: DS.attr(),
  physioID: DS.belongsTo('physiotherapest'),
  date: DS.attr('Date'),
  exerciseList: DS.hasMany('exercise-list'),
  assessmentTests: DS.hasMany('assessment-test')
});
