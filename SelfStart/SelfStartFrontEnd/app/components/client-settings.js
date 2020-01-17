import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import moment from 'moment';
import $ from 'jquery';

export default Component.extend({
  auth: inject('auth'),
  DS: inject('store'),
  routing: inject('-routing'),
  onProfile: true,
  onAccount: false,
  onHistory: false,
  onAppointment: false,
  onProfileColor: "white",
  onAccountColor: "#747474",
  onHistoryColor: "#747474",
  onAppointmentColor: "#747474",

  pateintsData : null,
  appointmentHistory: Ember.A(),

  OPC:Ember.computed('onProfileColor', function() {
    var color = (this.get('onProfileColor'));
    return new Ember.String.htmlSafe("color: " + color);
  }),
  OAC:Ember.computed('onAccountColor', function() {
    var color = (this.get('onAccountColor'));
    return new Ember.String.htmlSafe("color: " + color);
  }),
  OHC:Ember.computed('onHistoryColor', function() {
    var color = (this.get('onHistoryColor'));
    return new Ember.String.htmlSafe("color: " + color);
  }),
  OAPC:Ember.computed('onAppointmentColor', function() {
    var color = (this.get('onAppointmentColor'));
    return new Ember.String.htmlSafe("color: " + color);
  }),




  didRender() {
    this._super(...arguments);

    // let date = this.get('DOB');
    // this.set('selectedDate', date.toISOString().substring(0, 10));
    $(document).ready(function ($) {
      if ($('.floating-labels').length > 0) floatLabels();

      function floatLabels() {
        let inputFields = $('.floating-labels .cd-label').next();
        inputFields.each(function () {
          let singleInput = $(this);
          //check if  is filling one of the form fields
          checkVal(singleInput);
          singleInput.on('change keyup', function () {
            checkVal(singleInput);
          });
        });
      }

      function checkVal(inputField) {
        ( inputField.val() == '' ) ? inputField.prev('.cd-label').removeClass('float') : inputField.prev('.cd-label').addClass('float');
      }

    });
  },
  init(){
    this._super(...arguments);
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);

    self.get('DS').queryRecord('patient', {filter: {'email' : eemail}}).then(function (temp) {

        self.set('pateintsData', temp);
        let dateString = moment(self.get('pateintsData').get('dateOfBirth'),'DD-MM-YYYY').toISOString().substring(0, 10);
        self.set('selectedDate', dateString);

      let client = self.get('pateintsData');
        self.get('DS').query('appointment', {filter: {'id' : client.get('id')}}).then(function (obj) {
        obj.forEach(function (temp){
          temp.set('date', moment(temp.get('date')).format('YYYY-MM-DD hh:mm A'));
          self.get('appointmentHistory').pushObject(temp);
        });
      });
    });

  },
  conutryModel: computed(function(){
    return this.get('DS').findAll('country');
  }),

  genderModel: computed(function(){
    return this.get('DS').findAll('gender');
  }),
  actions:{
    assignDate (date){
      this.set('selectedDate', date);
    },
    selectGender (gender){
      this.set('selectedGender', gender);
    },
    selectCountry (country){
      this.set('selectedCountry', country);
    },
    ProfileClick(){
      this.set('onProfile', true);
      this.set('onAccount', false);
      this.set('onHistory', false);
      this.set('onAppointment', false);
      this.set('onAppointmentColor', '#747474');
      this.set('onProfileColor', 'white');
      this.set('onAccountColor',  '#747474');
      this.set('onHistoryColor', '#747474');
    },
    settingsClick(){
      this.set('onProfile', false);
      this.set('onAccount', true);
      this.set('onHistory', false);
      this.set('onAppointment', false);
      this.set('onAppointmentColor', '#747474');
      this.set('onProfileColor', '#747474');
      this.set('onAccountColor',  'white');
      this.set('onHistoryColor', '#747474');
    },
    historyClick(){
      this.set('onProfile', false);
      this.set('onAccount', false);
      this.set('onHistory', true);
      this.set('onAppointment', false);
      this.set('onAppointmentColor', '#747474');
      this.set('onProfileColor', '#747474');
      this.set('onAccountColor',  '#747474');
      this.set('onHistoryColor', 'white');
    },
    appointmentClick(){
      this.set('onProfile', false);
      this.set('onAccount', false);
      this.set('onHistory', false);
      this.set('onAppointment', true);
      this.set('onAppointmentColor', 'white');
      this.set('onProfileColor', '#747474');
      this.set('onAccountColor',  '#747474');
      this.set('onHistoryColor', '#747474');
    },
    saveChange(){
      //check for email first
      let rec = this.get('pateintsData');
      rec.set('familyName', this.get('pateintsData.familyName'));
      rec.set('givenName', this.get('pateintsData.givenName'));
      rec.set('streetName', this.get('pateintsData.streetName'));
      rec.set('streetNumber', this.get('pateintsData.streetNumber'));
      rec.set('apartment', this.get('pateintsData.apartment'));
      rec.set('country', this.get('selectedCountry'));
      rec.set('province', this.get('pateintsData.province'));
      rec.set('city', this.get('pateintsData.city'));
      rec.set('gender', this.get('selectedGender'));
      rec.set('dateOfBirth', new Date(this.get('selectedDate')));
      rec.set('phoneNumber', this.get('pateintsData.phoneNumber'));
      rec.set('postalCode', this.get('pateintsData.postalCode'));

      rec.save().then(() => {
        alert("Saved");
      });

    },

    savePassword(){

      let self = this;
      let auth = this.get('auth');

      let old =(this.get('oldPassword'));
      let hashedold = auth.hash(old);

      let newp = (this.get('newPassword'));
      let confp= (this.get('confirmPassword'));

      let cliente =this.get('pateintsData').get('email');
      console.log(cliente);

      if (newp !== confp){
       alert("wrong password or new password does not match");
      }
      else{
        newp = auth.hash(newp);
        self.get('DS').queryRecord('password', {filter: {'email': cliente}}).then(function (obj) {
          console.log(obj);


          obj.set('encryptedPassword', hashedold);
          obj.set('updatePassword' , true);
          obj.set('newPass', newp);
          obj.save().then((res)=>{
            console.log(res);
            alert("worked");
          });

          // console.log(obj);
          // hashedold = auth.hash(hashedold+ obj.get('salt'));
          // console.log(hashedold);
          // if (hashedold === obj.get('encryptedPassword')){
          //   obj.set('encryptedPassword', auth.hash(newp));
          //   obj.set('passwordMustChanged', true);
          //   obj.save((res)=>{
          //     alert("saved new password");
          //   });
          // }
          // else{
          //   alert("wrong password or new password does not match");
          // }

        });
      }






    },
  },
});
