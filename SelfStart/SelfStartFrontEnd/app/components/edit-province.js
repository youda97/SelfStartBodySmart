import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  selectedCountry: null,
  provinceData: null,
  // name: computed.oneWay('provinceData.name'),

  modalName: computed(function () {
    return 'editProvince' + this.get('provinceData').id;
  }),

  init(){
    this._super(...arguments);

    this.set('selectedCountry', this.get('provinceData').get('country.name'));
  },

  actions: {
    selectCountry(country) {
      this.set('selectedCountry', country);
    },

    submit(){
      let self= this;

      var countryId = this.get('selectedCountry');

      this.get('DS').findRecord('province', this.get('provinceData').id).then((rec) =>{
        rec.set('name', this.get('provinceData.name'));

        this.get('DS').findRecord('country', countryId).then(function (src) {
          rec.set('country', src);
          rec.save().then(()=>{

            $('.ui.' + self.get('modalName') + '.modal').modal('hide');
          });
        });
      });
      this.set('name', '');
      this.set('selectedCountry', null);
    },

    openModal: function () {
      //this.set('provinceData', this.get('DS').peekRecord('province', this.get('ID')));

      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',

        onDeny: () => {
          return true;
        },

      })
        .modal('show');
    },
  }
});
