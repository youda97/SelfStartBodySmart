import DS from 'ember-data';
import { empty } from '@ember/object/computed';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  authorName: DS.belongsTo('physiotherapest'),
  rehabPlan: DS.belongsTo('rehabilitationplan'),
  form:DS.belongsTo('form'),
  patient:DS.belongsTo('patient'),
  answer:DS.hasMany('answer')
});

//SEND FORM BUTTON
// create record assessmenttest
// questions = form.questions
// answers empty
// patient = thispatient

//Client fills out form and answers are loaded into test array
