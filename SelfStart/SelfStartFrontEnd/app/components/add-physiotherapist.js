import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  flagAdd: null,
  tagName: '',
  authentication: inject('auth'),

  init(){
    this._super(...arguments);



    // this.set('selectedGender', this.get('selectedGender'));
    // this.set('selectedCountry', this.get('selectedCountry'));
  },

  didRender() {
    this._super(...arguments);


    $(document).ready(function ($) {
      if ($('.floating-labels').length > 0) floatLabels();

      function floatLabels() {
        var inputFields = $('.floating-labels .cd-label').next();
        inputFields.each(function () {
          var singleInput = $(this);
          //check if user is filling one of the form fields
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


  actions: {

    selectGender (gender){
      this.set('selectedGender', gender);
    },

    assignHiredDate (date){
      this.set('selectedHiredDate', date);
    },
    assignFiredDate (date){
      this.set('selectedFiredDate', date);
    },

    submit () {

      let self = this;


      let passwords = this.get('DS').createRecord('password', {
        email: self.get('email'),
        encryptedPassword: self.get('authentication').hash(self.get('encryptedPassword')),
        passwordMustChanged : true,
        passwordReset:true,
      });

      passwords.save().then((passwords) => {


        var lastName =  self.get('familyName');
        var firstName =  self.get('givenName');
        var mail = self.get('email');




        let physiotherapist = this.get('DS').createRecord('physiotherapest', {
          familyName: lastName.charAt(0).toUpperCase() + lastName.substring(1),
          givenName: firstName.charAt(0).toUpperCase() + firstName.substring(1),
          email: mail.substring(0).toLowerCase(),
          encryptedPassword: passwords,
          dateHired: new Date(this.get('selectedHiredDate')),
          gender: self.get('gender'),
          phoneNumber: self.get('phoneNumber'),
          //treatment: self.get('treatment'),
        });
        physiotherapist.save().then((res) =>{
          console.log('this is the response', res);
          console.log(res.get("success"));
          if(!res.get("success")) {
            console.log("FAILED")
            res.destroyRecord().then(o => {
              console.log("destroyed", o);
            });
            passwords.destroyRecord().then(o => {});
          } else{
            console.log("SUCCESS", res);
            passwords.set('practitioner', res);
            passwords.save();
          }

          if (this.get('flagAdd')=== true)
            this.set('flagAdd', false);
          else
            this.set('flagAdd', true);
          $('.ui.newPhysio.modal').modal('hide');

          this.set('familyName', '');
          this.set('givenName', '');
          this.set('email', '');
          this.set('selectedGender', '');
          this.set('dateHired', '');
          this.set('dateFired', '');
          this.set('phoneNumber', '');
          this.set('encryptedPassword', '');

          return true;
        });

      });


    },
    openModal: function ()  {
      $('.ui.newPhysio.modal').modal({
        closable: false,

        onDeny: () => {
          return true;
        },

      }).modal('show')
    },
  }

});
