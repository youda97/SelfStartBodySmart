import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Ember from "ember";

export default Component.extend({
  store: inject('store'),
  auth: inject('auth'),
  patientsData: null,
  photoList:[],
  flagAdd: false,
  flagDelete:false,
  disabled: null,
  bookingPhotos: [],

  activeModel: Ember.observer('flagDelete','flagAdd', function () {
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);


    self.get('store').queryRecord('patient', {filter: {'email' : eemail}}).then(function (temp) {
      self.set('patientsData', temp);
      console.log(temp.get("id"));

      });

      // self.get('store').query('image', {filter: {'patient': temp.get("id")}}).then((records) => {
      //   self.get('photoList').clear();
      //
      //   records.forEach(im => {
      //     if(im.get("patient").get("id") === temp.get("id"))
      //       self.get("photoList").pushObject(im);
      //   });
      // })
    //});

  }),

  // init(){
  //   this._super(...arguments);
  //   let self = this;
  //   let eemail = localStorage.getItem('sas-session-id');
  //   eemail = this.get('auth').decrypt(eemail);
  //   console.log(eemail);
  //
  //   self.get('store').queryRecord('patient', {filter: {'email' : eemail}}).then(function (temp) {
  //     self.set('patientsData', temp);
  //     console.log(temp.get("id"));
  //     self.get('store').query('image', {filter: {'patient': temp.get("id")}}).then((records) => {
  //       records.forEach(im => {
  //         if(im.get("patient").get("id") === temp.get("id"))
  //           self.get("photoList").pushObject(im);
  //       });
  //     })
  //   });
  // },
});
