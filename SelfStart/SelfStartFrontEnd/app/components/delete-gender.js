import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  genderDelete: null,

  modalName: computed(function () {
    return 'Delete-gender' + this.get('ID');
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

            let gender = this.get('DS').peekRecord('gender', this.get('ID'));
            gender.destroyRecord().then(()=>{
              if (this.get('genderDelete')=== true)
                this.set('genderDelete', false);
              else
                this.set('genderDelete', true);
              return true;
            });


        }
      })
        .modal('show');
    },
  }
});


