import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  client: null,
  DS: inject('store'),
  auth: inject('auth'),

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
        var price = 150;
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
          finalTransaction["package"] = "Package 1";
          finalTransaction["date"] = date;
          finalTransaction["amount"] = total;

          var pack = [];
          pack["numberOfSessions"] = 0;
          pack["appointments"] = null;
          pack['order'] = 0;

          self.get('DS').findRecord('patient', self.get('client').get('id')).then((cli) => {
            let length = cli.get('transactions').length;
            let length2 = cli.get('packages').length;

            var temp = cli.get('transactions');
            var temp2 = cli.get('packages');

            temp2.pushObject(pack);
            temp.pushObject(finalTransaction);
            cli.set('transactions', temp);

            cli.save().then( obj => {
              self.get('DS').findRecord('patient', self.get('client').get('id')).then((cli) => { 
                let item = cli.get('transactions')[length];
                Ember.set(item, 'package', "Package 1");
                Ember.set(item, 'date', date);
                Ember.set(item, 'amount', total);

                let item2 = cli.get('packages')[length2];
                Ember.set(item2, 'numberOfSessions', 1);
                Ember.set(item2, 'appointments', []);
                Ember.set(item2, 'order', length2);
                localStorage.setItem('order', length2.toString());
                cli.save();
              })
            })
          })
        });
      }
    }, '#paypal-button-container');
  }
});
