import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({

  DS: Ember.inject.service('store'),



  edit: false,

  questionsModel: Ember.computed(function(){
    return this.get('DS').findAll('question');
  }),

  actions: {

    addQuestion(thisQuestion, thisForm, qid){
      thisForm.get('questions').pushObject(thisQuestion);
      thisQuestion.get('forms').pushObject(thisForm);

      this.get('DS').findRecord('form', this.get('ID')).then((rec) => {
        rec.save().then(()=>{
        });
      });

      this.get('DS').findRecord('question', qid).then((rec) => {
        rec.save().then(()=>{
        });
      });
    },
  }
});
