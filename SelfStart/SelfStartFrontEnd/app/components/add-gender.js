import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  genderAdd: null,

  actions: {
    openModal: function ()  {
      this.set('name', null);

      $('.ui.small.newGender.modal').modal({
        closable: false,

        onDeny:  () => {
          return true;
        },

        onApprove: () => {

          let newGender = this.get('DS').createRecord('gender', {
            name: this.get('name'),
          });
          newGender.save().then(()=> {
            if (this.get('genderAdd')=== true)
              this.set('genderAdd', false);
            else
              this.set('genderAdd', true);
            return true;
          });
        }
      }).modal('show')
    },
  }

});

