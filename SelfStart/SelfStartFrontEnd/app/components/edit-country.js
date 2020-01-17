import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  countryData: null,
  name: computed.oneWay('countryData.name'),

  modalName: computed(function () {
    return 'editCountry' + this.get('ID');
  }),



  actions: {
    openModal: function () {
      this.set('countryData', this.get('DS').peekRecord('country', this.get('ID')));


      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',

        onDeny: () => {
          return true;
        },

        onApprove: () => {
          this.get('DS').findRecord('country', this.get('ID')).then((rec) =>{
            rec.set('name', this.get('name') );
            rec.save().then(()=>{
              return true;
            });
          });
        }
      })
        .modal('show');
    }
  },
});
