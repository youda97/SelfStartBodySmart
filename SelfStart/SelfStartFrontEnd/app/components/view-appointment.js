import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  DS: inject('store'),
  routing: inject('-routing'),
  isEditing: false,
  selectedclient: null,
  getclient: computed(function(){
    return this.get('DS').findAll('patient');
  }),

  appointmenthistory: null,


  actions: {


    // bookAppointment(){
    //   this.set('isEditing', true);
    // },
    //
    // cancelbookingappointment(){
    //   this.set('isEditing', false);
    // },

    updateValue(physio){
      this.set('selectedphysio', this.get('DS').peekRecord('physiotherapest', physio));
      //get associated physiotherapist schedule
      let container = this.get('selectedphysio').get('appointments').filter(function(item){
        let cur_time = new Date();
        cur_time=  cur_time.toISOString();
        return item.get('date') > cur_time;
      });
      //set appointment filter to the container
      this.set('appointments_filter',  container);

    },

    // updateValue(client){
    //   this.set('selectedclient', this.get('DS').findRecord('patient', client);
    //
    //
    //
    // },

  },

});
