import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  flagDelete: null,

  modalName: computed(function(){
    return 'Delete-form' + this.get('ID');
  }),

  actions: {
    openModal: function () {
      $('.ui.' + this.get('modalName') + '.modal').modal({
        closeable: false,
        transition: 'fly down',
        onDeny: () => {
          return true;
        },
        onApprove: () => {

          let form = this.get('DS').peekRecord('form', this.get('ID'));

          form.destroyRecord().then(()=> {
            if (this.get('flagDelete') === true)
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
