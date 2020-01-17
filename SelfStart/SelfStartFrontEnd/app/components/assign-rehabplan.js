import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';
import Ember from 'ember';

export default Component.extend({
  plansData: null,
  store: inject('store'),
  model: null,
  ajax: Ember.inject.service(),
  disabled: "",

  modalName: computed(function () {
    return 'editAssign' + this.get('plansData');
  }),

  // planChange: Ember.observer('plansData', function () {
  //   let client = this.get('model').id;
  //   let plan = this.get('plansData');
  //
  //   this.get('store').query('rehab-client-link', {filter: {'RehabilitationPlan': plan, 'Patient': client}}).then((update) => {
  //     console.log(update.content.length);
  //     if (update.content.length !== 0) {
  //       this.set('disabled', "disabled");
  //     } else {
  //       this.set('disabled', "");
  //     }
  //   })
  // }),

  didInsertElement(){
    this._super(...arguments);

    let client = this.get('model').id;
    let plan = this.get('plansData');

    this.get('store').query('rehab-client-link', {filter: {'RehabilitationPlan': plan, 'Patient': client}}).then((update) => {
      console.log(plan);
      console.log(update.content.length);
      if (update.content.length !== 0) {
        this.set('disabled', "disabled");
      } else {
        this.set('disabled', "");
      }
    })
  },

  actions: {

    openModal: function () {
      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,

        transition: 'fly down',

        onDeny: () => {
          return true;
        },
        onApprove: () => {
          let plan = this.get('plansData');

          var planRecord = this.get('store').peekRecord('rehabilitationplan', plan);

          let link = this.get('store').createRecord('rehab-client-link', {
            terminated: this.get('plansData.terminated'),
            RehabilitationPlan: planRecord,
            Patient: this.get('model'),
            assigned: true
          });
          link.save().then((res)=> {
              $('.ui.' + this.get('modalName') + '.modal').modal('hide');
              this.set('disabled', "disabled");
          });
        }
      })
        .modal('show');
    },
  }
});
