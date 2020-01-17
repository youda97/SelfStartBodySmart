import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    DS: inject('store'),

    isEditing: false,
    count: 0,

    actions: {
        addFQ (){
            this.set('isEditing', true);
        },

        cancel: function () {
            this.set('isEditing', false);
        },

        submit: function () {

            // let self = this;

            let form = this.get('DS').createRecord('form', {
               // question: self.get.objectAt('newQuestion'),
               // )
            });

            form.save().then(function() {
              this.set('isEditing', false);
              return true;
            });
          }
    }
});

