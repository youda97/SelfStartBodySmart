import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('payment-button-package-additional', 'Integration | Component | payment button package additional', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{payment-button-package-additional}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#payment-button-package-additional}}
      template block text
    {{/payment-button-package-additional}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
