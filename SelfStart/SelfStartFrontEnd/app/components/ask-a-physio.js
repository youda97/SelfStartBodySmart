import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),

  actions:{

    submit(){
      let self = this;


      let ask = this.get('DS').createRecord('ask-physio', {
        firstName: self.get('firstName'),
        lastName: self.get('lastName'),
        email: self.get('email'),
        comment: self.get('comment'),
      });

      ask.save().then(() => {
        $('.ui.ask.modal').modal('hide');
      });
    },

    openModal: function ()  {
      this.set('firstName', '');
      this.set('lastName', '');
      this.set('email', '');
      this.set('comment', '');

      $('.ui.ask.modal').modal({

        onDeny: () => {
          return true;
        },

      }).modal('show')
    },
  }

});
