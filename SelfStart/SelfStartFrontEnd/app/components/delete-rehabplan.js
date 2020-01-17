import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  flagDelete: null,

  modalName: computed(function () {
    return 'Delete-plan' + this.get('ID');

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

          let plan = this.get('DS').peekRecord('rehabilitationplan', this.get('ID'));

          plan.destroyRecord().then(()=>{
            if (this.get('flagDelete')=== true)
              this.set('flagDelete', false);
            else
              this.set('flagDelete', true);
            return true;
          });

        }
      })
        .modal('show');
    },
  }
});

