import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  selectedProvince: null,


  actions: {

    selectProvince(province) {
      this.set('selectedProvince', province);
      console.log(this.get('selectedProvince'))
    },

    submit(){
      let self = this;

      let newCity = this.get('DS').createRecord('city', {
        name: self.get('name'),
      });

      this.get('DS').findRecord('province', self.get('selectedProvince')).then(function (src) {
      console.log(src);

        newCity.set('province', src);

        newCity.save().then(function ()  {
          $('.ui.small.newCity.modal').modal('hide');
        });
      });

      this.set('name', '');
      this.set('selectedProvince', null);
    },

    openModal: function () {

      $('.ui.small.newCity.modal').modal({
        closable: false,

        onDeny: () => {
          return true;
        },
      }).modal('show');
    },
  }
});


