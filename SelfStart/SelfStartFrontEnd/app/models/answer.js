import DS from 'ember-data';

export default DS.Model.extend({
  test: DS.belongsTo("assessment-test"),
  question: DS.attr(),
  answer: DS.attr()
});
