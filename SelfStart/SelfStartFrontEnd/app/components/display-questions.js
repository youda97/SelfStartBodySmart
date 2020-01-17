import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({

  DS: inject('store'),
  questionNumber: 54,
  formModel: [],

  modalName: computed(function () {
    return 'viewForm' + this.get('model').id + this.get('model.questionOrder.firstObject.id');
  }),

  init(){
    this._super(...arguments);
    this.get('DS').query('question-order', {filter: {'form': this.get('model').id}}).then((questions) => {

      this.get('formModel').clear();

      questions.forEach((q)=>{
        // console.log(q.get('question'));
        this.get('formModel').pushObject(q.get('question'));
      });

    });
  },

  actions:{
    openModal: function () {

      $('.ui.' + this.get('modalName') + '.modal').modal({
        // transition: 'horizontal flip',

        // dimmerSettings: { opacity: 0.25 },


        onDeny: () => {
          return true;
        },
      })
        .modal('show');
    }
  }
  // formModel: Ember.computed(function(){
  //   return this.get('DS').find('forms', this.get('id'));
  // }),
});
