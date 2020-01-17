import Component from '@ember/component';
import Ember from "ember";


export default Component.extend({
  DS: Ember.inject.service('store'),
  initialized:false,
  order:[],
  arr: [],
  modalName: Ember.computed(function(){
    return 'Show-Questions' + this.get('ID');
  }),
  actions:{
    removeQuestion(q, f, qid, fid){
      f.get('questions').removeObject(q);
      q.get('forms').removeObject(f);

      console.log(fid);
      this.get('DS').findRecord('form', fid).then((rec) => {
        rec.save().then(()=>{
        });
      });

      this.get('DS').findRecord('question', qid).then((rec) => {
        rec.save().then(()=>{
        });
      });
    },

    orderChange(q,f, fid){
      let thisForm = this;
      if(!this.initialized){
        for(var x= 0; x < f.get('questions').get('length');x++){
          this.order[x] = x+1;
        }
        this.set('initialized',true);
      }
      console.log(this.order);
      var value = this.$('option:selected').val();
      const indexb = f.get('questions').indexOf(q);
      var option = this.$('option:selected');
      console.log(value);
      console.log(option);

      let temp = this.order[value];
      this.order[value] = this.order[indexb];
      this.order[indexb] = temp;

      console.log(this.order);

      // f.get('questions').forEach(function(q) {
      //     arr.pushObject(q);
      // });
      //     let tmp = arr.objectAt(indexb);
      //    // f.get('questions').removeAt(indexb);
      //    // f.get('questions').insertAt(value, tmp);
      //     arr.replace(indexb, 1,arr.objectAt(value));
      //     arr.replace(value, 1,tmp);
      //     console.log(arr);
      // this.get('DS').findRecord('form', fid).then((rec) => {
      //     rec.save().then(()=>{
      //     });
      // });

      // window.location.reload();
    },

    save(f, fid){
      for(var x= 0; x < this.order.length; x++){
        this.arr[x] = f.get('questions').objectAt(this.order[x] -1);
      }
      console.log(this.arr);

      f.get('questions').clear();
      for(var x= 0; x < this.order.length; x++){
        f.get('questions').pushObject(this.arr[x]);
      }
      this.get('DS').findRecord('form', fid).then((rec) => {
        rec.save().then(()=>{
        });
      });
    },
    openModal: function () {
      Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
        closeable: false,
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          return true;
        }
      })
        .modal('show');
    },
  },
});
