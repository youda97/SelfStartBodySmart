import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  DS: inject('store'),
  flagDelete: null,

  modalName: computed(function () {
    return 'Delete-patient' + this.get('ID.id');
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
          let a =(this.get('ID.id'));
          this.get('DS').findRecord('rehab-client-link',a).then((obj)=>{
            obj.set('terminated', true);
            obj.save().then(()=>{
              return true;
            })
          });
          // let patient = this.get('DS').peekRecord('assessment-test', this.get('ID'));
          // console.log(patient);
          // patient.set('terminated', true);
          // patient.save().then(()=>{
          //   return true;
          // })
        }
      })
        .modal('show');
    },
  }
});
