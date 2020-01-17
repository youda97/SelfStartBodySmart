import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';
import moment from 'moment';

export default Component.extend({
  auth: inject('auth'),
  occurrences: Ember.A(),
  availableSpot: Ember.A(),
  removedSpot: Ember.A(),
  paid: '',
  DS: inject('store'),
  routing: inject('-routing'),
  isEditing: false,
  paid: "disabled",
  appState: "active",
  bookState:"",
  followState:"",
  isApp:true,
  isBook:false,
  isfollow:false,
  purchasedPackages: [],
  modalName: Ember.computed(function(){
    return 'Book Appointment';
  }),
  givenName: null,
  familyName : null,
  timeSlots: Ember.A(),
  selectedappointmentBlock: null,
  selectedbookedTime:null,
  flagAdd: false,
  phyidget: null,
  client: null,
  appointmentHistory: Ember.A(),


  physioPicked : false,
  physioName : computed(function () {
    return this.get('givenName') + " " + this.get('familyName');
  }),

  getphysio: computed(function(){
    return this.get('DS').findAll('physiotherapest');
  }),

  init() {
    this._super(...arguments);
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);
    console.log(this.get('paid'));
    if(localStorage.getItem('order')){
      this.set("paid", "");
      // localStorage.removeItem('order');
    } else {
      this.set("paid", "disabled");
    }


    self.get('DS').queryRecord('patient', {filter: {'email' : eemail}}).then(function (obj) {
      self.set('client', obj);
      if(localStorage.getItem('increaseByOne')) {
        let inc = localStorage.getItem('increaseByOne');
        obj.get('packages').forEach(o =>{
        if(o.order === inc){
          let item2 = obj.get('packages')[inc];
          Ember.set(item2, 'numberOfSessions', obj.get('packages')[inc].numberOfSessions + 1);
        }
        })
      }
      obj.save();
      localStorage.removeItem('increaseByOne');
      self.set('purchasedPackages', obj.get('packages'));
      console.log(self.get('client.id'));
      self.get('DS').query('appointment', {filter: {'id' : self.get('client.id')}}).then(function (obj) {
        obj.forEach(function (a) {
          if(moment(a.get('date')) > moment()){
            self.get('appointmentHistory').pushObject(a);
          }
        });
      });
    });
  },

  didRender() {
    this._super(...arguments);
    if ($('.floating-labels').length > 0) floatLabels();

    function floatLabels() {
      var inputFields = $('.floating-labels .cd-label').next();
      inputFields.each(function () {
        var singleInput = $(this);
        //check if  is filling one of the form fields
        checkVal(singleInput);
        singleInput.on('change keyup', function () {
          checkVal(singleInput);
        });
      });
    }

    function checkVal(inputField) {
      ( inputField.val() == '' ) ? inputField.prev('.cd-label').removeClass('float') : inputField.prev('.cd-label').addClass('float');
    }
  },


  firstSelected: false,
  followupSelected: false,
  upcomingSelected: false,

  videoValue: "active",
  introValue: "disabled",
  appointmentValue: "disabled",
  photoValue: "disabled",
  confirmValue: "disabled",

  video: true,
  intro: false,
  appointment: false,
  photo: false,
  confirm: false,

  disabled: '',
  appDisable: '',
  array: [],
  showDetails: null,
  showBook: null,
  showBooked: null,
  orderAppts: [],
  actions: {
    goToIntro() {
      this.set('videoValue', "completed");
      this.set('introValue', "active");
      this.set('intro', true);
      this.set('video', false);
    },
    toggleDetails(ord) {
      if(this.get('showDetails')) {
        this.set('showDetails', null);
      } else {
        this.set('showBook', null);
        this.set('showBooked', null);
        this.set('showDetails', ord);
      }
    },

    toggleBook(ord) {

      if(this.get('client').get('packages')[ord].numberOfSessions) {
      if(this.get('showBook')) {
        this.set('showBook', null);
      } else {
        this.set('showBook', ord);
        this.set('showBooked', null);
        this.set('showDetails', null);
      }
    } else {
      alert('You must have sessions in order to book appointments');
    }
    },

    toggleBooked(ord) {
      let self = this;
      this.get('orderAppts').clear();
      if(this.get('showBooked')) {
        this.set('showBooked', null);
      } else {
        self.get('DS').query('appointment', {filter: {'id' : self.get('client.id')}}).then(function (obj) {
          obj.forEach(function (a) {
            if(a.get('order') === ord) {
              self.get('orderAppts').pushObject(a);
            }
          });
        });

        this.set('showBooked', ord);
        this.set('showBook', null);
        this.set('showDetails', null);
      }
    },

    goToPhoto() {
      this.set('introValue', "completed");
      this.set('photoValue', "active");
      this.set('photo', true);
      this.set('intro', false);
    },

    backToIntro() {
      this.set('introValue', "active");
      this.set('photoValue', "disabled");
      this.set('photo', false);
      this.set('intro', true);
    },
    goToConfirm() {
      this.set('confirmValue', "active");
      this.set('photoValue', "completed");
      this.set('photo', false);
      this.set('confirm', true);
    },

    backToVideo() {
      this.set('introValue', "disabled");
      this.set('videoValue', "active");
      this.set('intro', false);
      this.set('video', true);
    },

    backToPhoto() {
      this.set('photoValue', "active");
      this.set('confirmValue', "disabled");
      this.set('photo', true);
      this.set('confirm', false);
    },
    goToAppointment() {
      if(!localStorage.getItem('order')){
      alert('Please pay before going to the next step')
      } else {
      this.set('confirmValue', "completed");
      this.set('appointmentValue', "active");
      this.set('confirm', false);
      this.set('appointment', true);
      }
    },

    backToConfirm() {
      this.set('confirmValue', "active");
      this.set('appointmentValue', "");
      this.set('appointment', false);
      this.set('confirm', true);
    },
    goToPaypal() {

    },

    firstSelect: function(){
      this.set('firstSelected', true);
      this.set('followupSelected', false);
      this.set('upcomingSelected', false);

    },
    followupSelect: function(){
      this.set('firstSelected', false);
      this.set('upcomingSelected', false);
      this.set('followupSelected', true);
    },
    upcomingSelect: function(){
      this.set('firstSelected', false);
      this.set('followupSelected', false);
      this.set('upcomingSelected', true);
    },

    appView(){
      this.set('appState', "active");
      this.set('bookState', "");
      this.set('followState', "");
      this.set('isApp', true);
      this.set('isBook', false);
      this.set('isfollow', false);

    },
    bookView(){
      this.set('appState', "");
      this.set('bookState', "active");
      this.set('followState', "");
      this.set('isApp', false);
      this.set('isBook', true);
      this.set('isfollow', false);

    },
    followView(){
      this.set('appState', "");
      this.set('bookState', "");
      this.set('followState', "active");
      this.set('isApp', false);
      this.set('isBook', false);
      this.set('isfollow', true);
    },


    calendarAddOccurrence: function(occurrence) {
      // this.get('occurrences').pushObject(Ember.Object.create({
      //   title: occurrence.get('title'),
      //   startsAt: occurrence.get('startsAt'),
      //   endsAt: occurrence.get('endsAt')
      // }));
      //
      // console.log(JSON.stringify(this.get('occurrences')));
    },

    calendarUpdateOccurrence: function(occurrence, properties, isPreview) {
      console.log(JSON.stringify(occurrence));
      this.set('selectedappointmentBlock',occurrence);

      $('.ui.bk.modal').modal({
        closeable: false,
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          return true;
        }
      }).modal('show');
    },

    calendarRemoveOccurrence: function(occurrence) {
      // this.get('occurrences').removeObject(occurrence);
      // console.log(JSON.stringify(occurrence));
    },

    updateValue(physio){
      this.set('occurrences', Ember.A());

      let home= this;
      //save physioid
      this.set('selectedPhysioId', physio);
      //get record of selected physiotherapist
      this.get('DS').findRecord('physiotherapest', physio).then(function (phy){
        phy.set('updatingValue', true);
        phy.save().then(o=> {
          console.log(o);
        });
        //might not need this
        home.set('selectedphysio', phy);
        home.set('givenName', phy.get('givenName'));
        home.set('familyName', phy.get('familyName'));
        //get each appointment by  physiotherapist appointment
        phy.get('appointments').forEach( function(obj){
          let curid = obj.get('id');
          home.get('DS').findRecord('appointment',curid).then(function (app) {
            let scheduledDate = moment(app.get('date'));
            let endDate = moment(app.get('endDate'));
            //filter out any appointments that is previous to current date
            if (scheduledDate > moment()) {
              if (app.get('reason')==null) {
                home.get('occurrences').pushObject(Ember.Object.create({
                  title: "Book Appointments",
                  isDraggable: true,
                  startsAt: scheduledDate.toISOString(),
                  endsAt: endDate.toISOString(),
                  tempid : app.get('id')
                }));
              }
            }
          });
        });
      });
    },

    updateTime(type){
      // this.get('occurrences').pushObject(Ember.Object.create({
      //   title: occurrence.get('title'),
      //   startsAt: occurrence.get('startsAt'),
      //   endsAt: occurrence.get('endsAt')
      // }));
      this.set('timeSlots', Ember.A());


      let selected = this.get('selectedappointmentBlock');
      let start_time = selected.startsAt;
      let end_time = selected.endsAt;

      let amount;
      if (type === 't')
        amount = 60;
      else
        amount = 90;

      while(moment(start_time).add(amount, 'minute') <= moment(end_time)){
        this.get('timeSlots').pushObject(Ember.Object.create({
          time : moment(start_time),
          end : moment(start_time).add(amount, 'minute'),
          value : moment(start_time).format('hh:mm A')
        }));

        start_time = moment(start_time).add(30, 'minute');
      }
    },

    setselectedtime(t){
      let self = this;
      this.get('timeSlots').forEach(function (obj){
        if (moment(t).isSame(obj.time)) {
          self.set('selectedbookedTime', obj);
        }
      });
      console.log(JSON.stringify(this.get('selectedbookedTime')));

    },

    cancel_appointment(){
      this.set('Reason' , '');
      this.set('selectAppointmentType' , '');
      this.set('Other' , '');
      this.set('selectedTime' , '');
      this.set('timeSlots' , Ember.A());
      $('.ui.bk.modal').modal('hide');
    },

    submit() {
      let self = this;
      let src =self.get('client');

      let ord = 0;
      if(this.get("showBook")){
        ord = this.get("showBook");
      } else{
      ord = localStorage.getItem('order');
      }

      let item2 = src.get('packages')[ord];
      Ember.set(item2, 'numberOfSessions', src.get('packages')[ord].numberOfSessions - 1);

      //  src.get('packages').forEach(o=> {
      //   console.log(o.appointments);
      //   console.log(o.order);
      //   console.log(ord);
      //   // console.log()
      //   if(o.order === ord) {
      //     console.log("in here")
      //     src.set("o.numberOfSessions", o.numberOfSessions - 1);
      //   }
      // });
      //temp client until we get token
      //laptop
      // let client = '5ab9649cc7f3c62814754951';
      //desktop
      // let client = '5a88738e1f0fdc2b94498e81';
      let physio = self.get('selectphysio');

      console.log('ord', ord);
      let booking = this.get('DS').createRecord('appointment', {
        order: ord,
        reason: self.get('Reason'),
        other: self.get('Other'),
        date: self.get('selectedbookedTime').time,
        endDate: self.get('selectedbookedTime').end,
        pName: self.get('physioName'),
      });

      // let ord = localStorage.getItem('order');
      console.log(src.get('packages'));



      // src.save();

        console.log(src);
        booking.set('patient', src);
        let a = [];
        src.get('appointments').pushObject(booking);
        booking.save().then(function (ba){

          src.save().then(()=>{
            self.set('appDisable', '');
            self.get('DS').findRecord('physiotherapest',self.get('selectedPhysioId')).then(function (a) {
              a.get('appointments').pushObject(booking);
              a.save().then(()=>{
                //{"title":"Book Appointment","startsAt":"2018-03-16T13:00:00.000Z","endsAt":"2018-03-16T17:30:00.000Z","tempid":"5aa9d71c004e3909bc597bba"}
                let usedBlock = self.get('selectedappointmentBlock');
                //time":"2018-03-16T13:00:00.000Z","end":"2018-03-16T14:30:00.000Z","value":"09:00
                let bookedTime = self.get('selectedbookedTime');
                //remove the block you used

                //case 1 if the slots are exact
                if (moment(usedBlock.startsAt).isSame(bookedTime.time) && moment(usedBlock.endsAt).isSame(bookedTime.end)){
                  console.log("case 1");
                  self.get('DS').findRecord('appointment', usedBlock.tempid).then(function (old){
                    old.destroyRecord().then(() =>{
                      $('.ui.bk.modal').modal('hide');
                      // window.location.reload();
                    });
                  });
                }
                //case 2 booked at the start block
                else if (moment(usedBlock.startsAt).isSame(bookedTime.time)){
                  console.log("case 2");
                  self.get('DS').findRecord('appointment', usedBlock.tempid).then(function (old){
                    old.set('date', bookedTime.end);
                    old.save().then(() => {
                      $('.ui.bk.modal').modal('hide');
                      // window.location.reload();
                    });
                  });
                }
                //case 3 booked at the end block
                else if (moment(usedBlock.endsAt).isSame(bookedTime.end)){
                  console.log("case 3");
                  self.get('DS').findRecord('appointment', usedBlock.tempid).then(function (old){
                    old.set('endDate', bookedTime.time);
                    old.save().then(() => {
                      $('.ui.bk.modal').modal('hide');
                      // window.location.reload();
                    });
                  });
                }
                //case 4 booked in between
                else {
                  //create 2 segmented block
                  let topappo = self.get('DS').createRecord('appointment', {

                    date: usedBlock.startsAt,
                    endDate: bookedTime.time,
                    order: ord
                  });
                  let bottomappo = self.get('DS').createRecord('appointment', {
                    date: bookedTime.end,
                    endDate: usedBlock.endsAt,
                    order: ord
                  });
                  topappo.save().then(()=>{
                    bottomappo.save().then(()=>{
                      a.get('appointments').pushObject(topappo);
                      a.get('appointments').pushObject(bottomappo);
                      a.save().then(() => {
                        //remove old block
                        self.get('DS').findRecord('appointment' , usedBlock.tempid).then((rec)=>{
                          a.get('appointments').removeObject(rec);
                          a.save().then(()=> {
                            rec.destroyRecord().then(() =>{
                              $('.ui.bk.modal').modal('hide');
                              // window.location.reload();
                            });
                          })
                        })
                      });
                    })
                  });
                }
              });
            });
          });
        });
        localStorage.removeItem("order");
        // this.set('firstSelected', false);
        // this.set('upcomingSelected', false);
        // this.set('followupSelected', false);
        // this.set("introValue", "active");
        // this.set("appointmentValue", "disabled");
        // this.set("photoValue", "disabled");
        // this.set("confirmValue", "disabled");

        window.location.reload();

        alert("Your Appopintment has been booked!");
   },
  }
});
