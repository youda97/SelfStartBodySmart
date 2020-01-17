import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';
import moment from 'moment';

export default Component.extend({
  auth: inject('auth'),
  occurrences: Ember.A(),
  DS: inject('store'),
  routing: inject('-routing'),
  availableSpot: Ember.A(),
  removedSpot: Ember.A(),
  bookedAppointment: Ember.A(),

  selectedphysio : null,
  selectedPhysioId: null,
  isEditing: false,

  // dragFinishText: false,
  // dragStartedText: false,
  // dragEndedText: false,
  // myObject:{id:1, name:'objectName'},

  getphysio: computed(function(){
    return this.get('DS').findAll('physiotherapest');
  }),
  init(){
    this._super(...arguments);
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);

    this.set('occurrences', Ember.A());
    this.set('removedSpot', Ember.A());

    let home= this;
    //save physioid
    //get record of selected physiotherapist
    this.get('DS').queryRecord('physiotherapest',{filter: {'email': eemail}}).then(function (phy){
      //might not need this
      console.log(phy);
      home.set('selectedphysio', phy);
      home.set('selectedPhysioId', phy.get('id'));
      //get each appointment by  physiotherapist appointment
      phy.get('appointments').forEach( function(obj){
        let curid = obj.get('id');
        home.get('DS').findRecord('appointment',curid).then(function (app) {
          let scheduledDate = moment(app.get('date'));
          let endDate = moment(app.get('endDate'));
          //filter out any appointments that is previous to current date
          if (scheduledDate > moment()) {
            if (app.get('reason')!= null) {

              let newBooked = Ember.Object.create({
                title: "Booked",
                isFilled: true,
                isDraggable: false,
                isResizable: false,
                isRemovable: false,
                startsAt: scheduledDate.toISOString(),
                endsAt: endDate.toISOString()
              });
              home.get('occurrences').pushObject(newBooked);
              home.get('bookedAppointment').pushObject(newBooked);
            }
            else {
              let temp = Ember.Object.create({
                title: "Available Spot",
                isFilled: false,
                isDraggable: true,
                isResizable: true,
                isRemovable: true,
                startsAt: scheduledDate.toISOString(),
                endsAt: endDate.toISOString(),
                tempid : app.get('id')
              });
              home.get('occurrences').pushObject(temp);
              home.get('availableSpot').pushObject(temp);
            }
          }
        });
      });
    });
  },


  actions: {
    //add delete, update
    calendarAddOccurrence: function(occurrence) {
      let container = Ember.Object.create({

        title: "Available Spot",
        startsAt: occurrence.get('startsAt'),
        isDraggable: true,
        isResizable: true,
        isRemovable: true,
        endsAt: occurrence.get('endsAt')
      });
      this.get('occurrences').pushObject(container);
      this.get('availableSpot').pushObject(container);
      console.log(JSON.stringify(this.get('availableSpot')));
    },


    calendarUpdateOccurrence: function(occurrence, properties, isPreview) {
      // console.log(JSON.stringify(occurrence));
      occurrence.setProperties(properties);
      // console.log(JSON.stringify(this.get('availableSpot')));
    },

    calendarRemoveOccurrence: function(occurrence) {
      if (occurrence.tempid != null){
        this.get('removedSpot').addObject(occurrence.tempid);
      }
      this.get('occurrences').removeObject(occurrence);
      this.get('availableSpot').removeObject(occurrence);
      console.log(JSON.stringify(this.get('availableSpot')));
      console.log(JSON.stringify(this.get('removedSpot')));
    },


    viewschedule(){
      this.set('isEditing', true);
    },


    // getclient(pid){
    //   console.log("getlient invoked");
    //   this.get('DS').findRecord('patient', pid).then(function (src){
    //
    //     let a = src.get('familyName');
    //     let b = src.get('givenName');
    //     console.log(a.toString());
    //     console.log(b.toString());
    //     return '';
    //   });
    // },

    // cancel() {
    //   return true;
    // },

    save(){
      let self = this;
      let physio = self.get('selectedPhysioId');
      this.get('DS').find('physiotherapest',physio).then(function (a) {
        self.get('availableSpot').forEach(function (e) {
          if (e.tempid == null) {
            let appo = self.get('DS').createRecord('appointment', {
              date: e.startsAt,
              endDate: e.endsAt
            });
            appo.save().then(() => {
              a.get('appointments').pushObject(appo);
              a.save().then(() => {
              });
            })
          }
          else{
            self.get('DS').findRecord('appointment', e.tempid).then((rec)=>{
              rec.set('date', e.startsAt);
              rec.set('endDate', e.endsAt);
              rec.save().then(()=>{
              });
            });
          }
        });

        self.get('removedSpot').forEach(function (e) {
          console.log(e);
          self.get('DS').findRecord('appointment' , e).then((rec)=>{
            a.get('appointments').removeObject(rec);
            a.save().then(()=> {
              rec.destroyRecord().then(() =>{
              });
            })

          })
        });

      });
      self.set('isEditing', false);

      //end of save function
    },
    //end of actions param
  },
  //end of component
});
