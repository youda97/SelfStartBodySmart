import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Ember from "ember";
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  flagEdit:false,
  pateintsData: null,
  tagName: '',
  countryName: null,
  provinceName: null,
  genderName: null,
  selectedGender: null,

init(){
  this._super(...arguments);

  var date = this.get('pateintsData').get('dateOfBirth');
  var dateString = date.toISOString().substring(0, 10);
  this.set('selectedDate', dateString);

  this.set('selectedGender', this.get('pateintsData').get('gender'));
  this.set('countryName', this.get('pateintsData').get('country'));

  this.set('provinceName', this.get('pateintsData').get('province'));
  this.get('DS').query('province', {filter: {'country': this.get('country')}}).then((provinces) => {
    this.get('provModel').clear();
    provinces.forEach((prov)=>{
      this.get('provModel').pushObject(prov);
    });

  });
},


  genderModel: computed(function(){
    return  this.get('DS').findAll('gender');
  }),


  modalName: computed(function () {
    return 'editPatient' + this.get('pateintsData').id;
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

    selectGender (gender){
      this.set('selectedGender', gender);
    },


    submit(){

      var self= this;

      var lastName =  self.get('pateintsData.familyName');
      var firstName =  self.get('pateintsData.givenName');
      var mail = self.get('pateintsData.email');

      if (self.get('country')) self.set('countryName',self.get('DS').peekRecord('country', self.get('country')).get('name'));
      if (self.get('province')) self.set('provinceName',self.get('DS').peekRecord('province', self.get('province')).get('name'));

      this.get('DS').findRecord('patient', this.get('pateintsData').id).then((rec) =>{
        rec.set('familyName', lastName.charAt(0).toUpperCase() + lastName.substring(1));
        rec.set('givenName', firstName.charAt(0).toUpperCase() + firstName.substring(1));
        rec.set('email', mail.substring(0).toLowerCase());
        rec.set('streetName', this.get('pateintsData.streetName'));
        rec.set('streetNumber', this.get('pateintsData.streetNumber'));
        rec.set('apartment', this.get('pateintsData.apartment'));
        rec.set('country', self.get('countryName'));
        rec.set('province',  self.get('provinceName'));
        rec.set('city', this.get('pateintsData.city'));
        rec.set('healthCardNumber', this.get('pateintsData.healthCardNumber'));
        rec.set('gender', this.get('selectedGender'));
        rec.set('dateOfBirth', new Date(this.get('selectedDate')));
        rec.set('phoneNumber', this.get('pateintsData.phoneNumber'));
        rec.set('postalCode', this.get('pateintsData.postalCode'));

        rec.save().then(()=> {
          if (this.get('flagEdit')=== true)
            this.set('flagEdit', false);
          else
            this.set('flagEdit', true);
          $('.ui.' + this.get('modalName') + '.modal').modal('hide');
        });
      });
    },

    openModal: function () {

      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        centered: false,
        dimmerSettings: { opacity: 0.25 },
        onDeny: () => {
          return true;
        },

      })
        .modal('show');
    }
  },

});


