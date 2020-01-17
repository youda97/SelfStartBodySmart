import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  router: service(),
  DS: Ember.inject.service('store'),
  auth: inject('auth'),
  open:false,
  notOpen:true,
  linker: null,
  form: null,
  orders:[],
  ans:[],
  assessmentModel: Ember.computed(function(){

    console.log(this.get('assessmentTest.id'));
    return this.get('DS').find('assessment-test', this.get('assessmentTest.id'));
  }),
  assessmentTest: null,

  init() {
    this._super(...arguments);
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);

    self.get('DS').queryRecord('patient', {filter: {'email' : eemail}}).then(function (temp){
      self.get('DS').query('rehab-client-link', {filter: {
        'RehabilitationPlan' : self.get('planID'),
        'Patient' :temp.get('id'),
      }}).then(function (obj) {

        obj.forEach(function (AT) {
          self.set('assessmentTest', AT.get('assessmentTest'));
        });
        self.get('DS').findRecord('assessmentTest', self.get('assessmentTest').get('id')).then((at)=>{
          self.set('assessmentTest', at);
          console.log(self.get('assessmentTest').get('form.id'));

          self.get('DS').query('question-order', {filter: {'form':self.get('assessmentTest').get('form.id') }}).then((records) => {
            console.log(records);
            self.set('orders', records.toArray());
          });
          self.get('DS').query('answer', {filter: {'test':self.get('assessmentTest').get('id')}}).then((records) => {
            console.log(records);
            self.set('ans', records.toArray());
          });
        });
      });


    });


    //this.set('form', '5ac1ae2773e03d3f78384c92');
  },

  actions:{
    Open(){
      this.set("open", true);
      this.set("notOpen",false);
    },

  }
});
