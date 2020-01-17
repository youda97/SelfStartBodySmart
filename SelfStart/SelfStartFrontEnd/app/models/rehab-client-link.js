import DS from 'ember-data';
import assessmentTest from './assessment-test';

export default DS.Model.extend({
  terminated: DS.attr('boolean'),
  RehabilitationPlan: DS.belongsTo('rehabilitationplan'),
  Patient: DS.belongsTo('patient'),
  assigned: DS.attr('boolean'),
  assessmentTest: DS.belongsTo('assessment-test'),

});
