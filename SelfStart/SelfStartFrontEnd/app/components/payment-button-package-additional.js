import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  client: null,
  DS: inject('store'),
  auth: inject('auth'),
  Order:null,
  NOS: null,
  init() {
    this._super(...arguments);
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    this.get('DS').queryRecord('patient', {filter: {'email' : eemail}}).then(function (obj) {
      self.set('client', obj);
      console.log(self.get('client'));
    });

  },

  didRender : function() {
    let self = this;
    this._super(...arguments);
    paypal.Button.render({
      env: 'sandbox', // sandbox | production
// PayPal Client IDs - replace with your own
      client: {
        sandbox: 'AbdHTHtFqF1NS-TGHJYjER6WD91YBa-6784rZAGmZZMb7iUbS9UJbYDkrqdKBUWsk8rTKeiJM7NwjKax',
        production: ''
      },
// Show the buyer a 'Pay Now' button in the checkout flow
      commit: true,
// payment() is called when the button is clicked
      payment: function(data, actions) {
        var price = 75;
// Make a call to the REST api to create the payment
        return actions.payment.create({
          payment: {
            transactions: [{ amount: { total: price, currency: 'CAD' }}]
          }
        });
      },
// onAuthorize() is called when the buyer approves the payment
      onAuthorize: function(data, actions) {
// Make a call to the REST api to execute the payment
        return actions.payment.execute().then(function(transaction) {
          var trans = JSON.stringify(transaction);

          var index = trans.lastIndexOf('create_time":"');
          var date = trans.substring(index + 14,index + 34);

          index = trans.lastIndexOf('{"total":"');
          var total = trans.substring(index + 10,index + 16);

          var finalTransaction = [];//Ember.createObject({"Package 3", date, total});
          finalTransaction["package"] = "Additional Session";
          finalTransaction["date"] = date;
          finalTransaction["amount"] = total;

          var pack = [];
          pack["numberOfSessions"] = self.NOS;
          pack["appointments"] = null;
          pack['order'] = self.Order;

          self.get('DS').findRecord('patient', self.get('client').get('id')).then((cli) => {
            let length = cli.get('transactions').length;
            let length2 = cli.get('packages').length;

            var temp = cli.get('transactions');
            var temp2 = cli.get('packages');

            temp.pushObject(finalTransaction);
            cli.set('transactions', temp);
            console.log("b4 save", cli.get('packages'))
            cli.save().then( obj => {
              self.get('DS').findRecord('patient', self.get('client').get('id')).then((clientValue) => { 
                let item = cli.get('transactions')[length];
                Ember.set(item, 'package', "Package Additional Session");
                Ember.set(item, 'date', date);
                Ember.set(item, 'amount', total);

                // let item2 = clientValue.get('packages')[length2];
                // console.log("this is item2", item2);
                // console.log("length2", length2)
                // console.log("after save", cli.get('packages'))
                // console.log(item2);
                // console.log(self.Order);
                // console.log(self.NOS);
                // console.log(self.NOS+1)
                // let i = self.NOS+1;
                // Ember.set(item2, 'order', self.Order);
                // Ember.set(item2, 'numberOfSessions', self.NOS+1);
                
                let item2 = clientValue.get('packages');
                let i = item2[self.Order];
                // console.log("item2", item2.numberOfSessions + 1);  
                Ember.set(i, 'numberOfSessions', clientValue.get('packages')[self.Order].numberOfSessions + 1);
                console.log(item2);
                clientValue.get('packages')[self.Order].numberOfSessions = clientValue.get('packages')[self.Order].numberOfSessions +1;
                // clientValue.set('packages', item2);
                // item2.save();
                console.log("clientV", clientValue);
                clientValue.save();
                localStorage.setItem('increaseByOne', self.Order);
                window.location.reload();
              })
            })
          })
        });
      }
    }, '#paypal-button-container-package-additional');
  }
});
