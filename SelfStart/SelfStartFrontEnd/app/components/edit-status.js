import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  statusData: null,
  name: computed.oneWay('statusData.name'),

  modalName: computed(function () {
    return 'editStatus' + this.get('ID');
  }),


  actions: {
    openModal: function () {
      this.set('statusData', this.get('DS').peekRecord('maritalStatus', this.get('ID')));


      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        detachable: false,

        onDeny: () => {
          return true;
        },

        onApprove: () => {
          this.get('DS').findRecord('maritalStatus', this.get('ID')).then((rec) =>{
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

