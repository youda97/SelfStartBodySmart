import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  provinceDelete: null,

  modalName: computed(function () {
    return 'Delete-Province' + this.get('ID');
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

          let province = this.get('DS').peekRecord('province', this.get('ID'));
          province.destroyRecord().then(()=>{
            if (this.get('provinceDelete')=== true)
              this.set('provinceDelete', false);
            else
              this.set('provinceDelete', true);
            return true;
          });

        }
      })
        .modal('show');
    },
  }
});


