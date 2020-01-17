import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  genderData: null,
  name: computed.oneWay('genderData.name'),

  modalName: computed(function () {
    return 'editGender' + this.get('ID');
  }),



  actions: {
    openModal: function () {
      this.set('genderData', this.get('DS').peekRecord('gender', this.get('ID')));


      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',

        onDeny: () => {
          return true;
        },

        onApprove: () => {
          this.get('DS').findRecord('gender', this.get('ID')).then((rec) =>{
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
