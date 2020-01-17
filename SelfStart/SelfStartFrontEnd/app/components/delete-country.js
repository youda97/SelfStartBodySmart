import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  countryDelete: null,

  modalName: computed(function () {
    return 'Delete-Country' + this.get('ID');
  }),

  actions: {
    openModal: function () {
      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'fly down',
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          let country = this.get('DS').peekRecord('country', this.get('ID'));

          country.destroyRecord().then(()=>{
            if (this.get('countryDelete')=== true)
              this.set('countryDelete', false);
            else
              this.set('countryDelete', true);
            return true;
          });
        }
      })
        .modal('show');
    },
  }
});

