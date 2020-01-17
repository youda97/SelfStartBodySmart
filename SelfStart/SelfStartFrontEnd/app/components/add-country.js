import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  countryAdd: null,

  actions: {

    openModal: function ()  {
      this.set('name', null);

      $('.ui.small.newCountry.modal').modal({
        closable: false,

        onDeny:  () => {
          return true;
        },

        onApprove: () => {
          let newCountry = this.get('DS').createRecord('country', {
            name: this.get('name'),
          });
          newCountry.save().then(()=> {
            if (this.get('countryAdd')=== true)
              this.set('countryAdd', false);
            else
              this.set('countryAdd', true);
            return true;
          });
        }

      }).modal('show')
    },
  }

});


