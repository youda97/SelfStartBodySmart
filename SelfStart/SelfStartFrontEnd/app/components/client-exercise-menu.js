import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
export default Component.extend({
  auth: inject('auth'),
  DS: inject('store'),
  routing: inject('-routing'),

  clientData: null,
  rehabPlans: Ember.A(),
  init(){
    this._super(...arguments);
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);
    this.set('rehabPlans', Ember.A());
    self.get('DS').queryRecord('patient', {filter: {'email' : eemail}}).then(function (cd) {
      self.set('clientData', cd);
      //query to rehab link
      self.get('DS').query('rehab-client-link', {filter: {'id' : cd.get('id')}}).then(function (obj) {
        obj.forEach(function (temp) {
          if (!temp.get('terminated')){
            self.get('rehabPlans').pushObject(temp.get('RehabilitationPlan'));
          }
        });
      });
    });
  },



  actions:{
    gotoRehabplan(){

    },
  }
});
