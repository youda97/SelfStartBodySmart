import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Ember from "ember";
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  authentication: inject('auth'),



  tagName: '',
  flagAdd: false,

  init(){
    this._super(...arguments);

    this.set('familyName', '');
    this.set('givenName', '');
    this.set('email', '');
    this.set('streetName', '');
    this.set('streetNumber', '');
    this.set('apartment', '');
    this.set('selectedCountry', '');
    this.set('province', '');
    this.set('city', '');
    this.set('selectedDate', '');
    this.set('selectedGender', '');
    this.set('dateOfBirth', '');
    this.set('phoneNumber', '');
    this.set('postalCode', '');
    this.set('userAccountName', '');
    this.set('encryptedPassword', '');
  },

  didRender() {
    this._super(...arguments);

    $(document).ready(function ($) {
      if ($('.floating-labels').length > 0) floatLabels();

      function floatLabels() {
        var inputFields = $('.floating-labels .cd-label').next();
        inputFields.each(function () {
          var singleInput = $(this);
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

  genderModel: computed(function(){
    return this.get('DS').findAll('gender');
  }),

  provModel: [],

  provinces: Ember.observer('country', function(){
    this.get('DS').query('province', {filter: {'country': this.get('country')}}).then((provinces) => {

      this.get('provModel').clear();

      provinces.forEach((prov)=>{
        this.get('provModel').pushObject(prov);
      });
    });
  }),

  actions: {

    assignDate (date){
      this.set('selectedDate', date);
    },


    submit(){
      let self = this;


      let passwords = this.get('DS').createRecord('password', {
        email: self.get('email'),
        encryptedPassword: self.get('authentication').hash(self.get('encryptedPassword')),
        passwordMustChanged : true,
        passwordReset:true,
      });

      console.log("password b4 sent", passwords.get("encryptedPassword"));


      passwords.save().then((passwords) => {
        console.log("Password returned to front end after save", passwords);

          var lastName =  self.get('familyName');
          var firstName =  self.get('givenName');
          var mail = self.get('email');

        let patient = this.get('DS').createRecord('patient', {
          familyName: lastName.charAt(0).toUpperCase() + lastName.substring(1),
          givenName: firstName.charAt(0).toUpperCase() + firstName.substring(1),
          email: mail.substring(0).toLowerCase(),
          encryptedPassword: passwords,
          streetName: self.get('streetName'),
          streetNumber: self.get('streetNumber'),
          apartment: self.get('apartment'),
          country: self.get('DS').peekRecord('country', self.get('country')).get('name'),
          province: self.get('DS').peekRecord('province', self.get('province')).get('name'),
          city: self.get('city'),
          dateOfBirth: new Date(this.get('selectedDate')),
          gender: self.get('gender'),
          phoneNumber: self.get('phoneNumber'),
          postalCode: self.get('postalCode'),
        });

        patient.save().then((res) => {
          console.log('this is the response', res);
          console.log(res.get("success"));
          if(!res.get("success")) {
            console.log("FAILED")
            patient.destroyRecord().then(o => {
              console.log("destroyed", o);
            });
            passwords.destroyRecord().then(o => {});
          } else{

            if (this.get('flagAdd')=== true)
              this.set('flagAdd', false);
            else
              this.set('flagAdd', true);
            $('.ui.newPatient.modal').modal('hide');


            this.set('familyName', '');
            this.set('givenName', '');
            this.set('email', '');
            this.set('streetName', '');
            this.set('streetNumber', '');
            this.set('apartment', '');
            this.set('selectedCountry', '');
            this.set('province', '');
            this.set('city', '');
            this.set('selectedDate', '');
            this.set('selectedGender', '');
            this.set('dateOfBirth', '');
            this.set('phoneNumber', '');
            this.set('postalCode', '');
            this.set('userAccountName', '');
            this.set('encryptedPassword', '');
            // return true;
            console.log("SUCCESS", res);
            passwords.set('client', res);
            passwords.save();
          }
        });

      })

    },

    openModal: function ()  {
      $('.ui.newPatient.modal').modal({
        closable: false,

        onDeny: () => {
          return true;
        },

      }).modal('show')
    },
  }
});


