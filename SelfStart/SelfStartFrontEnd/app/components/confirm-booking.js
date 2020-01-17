import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({
  init: function() {
    this._super();
    //let a = this.get('DS').find('form', this.get('ID'));
    //console.log(a.get('name'));
  },

  DS: Ember.inject.service('store'),


  modalName: Ember.computed(function(){
    return 'confirm-booking' + this.get('ID');
  }),

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

      this.get('DS').findRecord('question', this.get('qid')).then((rec) => {
        rec.save().then(()=>{
        });
      });
    },
    manageForm() {
      this.set('edit',true);
    },
    done(){
      this.set('edit',false);
    },

    openModal: function () {
      Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
        closeable: false,
        detachable: false,
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          return true;
        }
      })
        .modal('show');
    },
  }
});
