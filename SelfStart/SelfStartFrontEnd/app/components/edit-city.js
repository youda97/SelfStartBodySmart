import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  selectedProvince: null,
  cityData: null,
  // name: computed.oneWay('cityData.name'),

  modalName: computed(function () {
    return 'editCity' + this.get('cityData').id;
  }),

  init(){
    this._super(...arguments);

    this.set('selectedProvince', this.get('cityData').get('province.name'));
  },

  actions: {
    selectProvince(province) {
      this.set('selectedProvince', province);
    },

    submit(){
      let self= this;

      var provinceId = this.get('selectedProvince');

      var ID = this.get('cityData').id;


      this.get('DS').findRecord('city', ID).then((rec) =>{
        rec.set('name', this.get('cityData.name'));

        console.log(provinceId);

        this.get('DS').findRecord('province', provinceId).then(function (src) {
          rec.set('province', src);

          rec.save().then(()=>{

            $('.ui.' + self.get('modalName') + '.modal').modal('hide');
          });
        });
      });
      this.set('name', '');
      this.set('selectedProvince', null);
    },

    openModal: function () {
      //this.set('cityData', this.get('DS').peekRecord('province', this.get('ID')));

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
