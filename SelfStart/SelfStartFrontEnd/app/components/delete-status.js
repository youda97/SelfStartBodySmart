import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  modalName: computed(function () {
    return 'Delete-maritalStatus' + this.get('ID');
  }),

  actions: {
    openModal: function () {
      $('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        detachable: false,
        transition: 'fly down',
        onDeny: () => {
          return true;
        },
        onApprove: () => {

          this.get('DS').find('maritalStatus', this.get('ID')).then((maritalStatus) => {

            maritalStatus.set('name', '');
            maritalStatus.save().then(function () {
              maritalStatus.destroyRecord();
            });
          });

        }
      })
        .modal('show');
    },
  }
});


