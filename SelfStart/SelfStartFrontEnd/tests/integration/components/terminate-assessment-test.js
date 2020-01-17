import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('terminate-assessment', 'Integration | Component | terminate assessment', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{terminate-assessment}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#terminate-assessment}}
      template block text
    {{/terminate-assessment}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
