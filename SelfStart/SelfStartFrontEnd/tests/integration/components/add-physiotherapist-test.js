import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add-physiotherapist', 'Integration | Component | add physiotherapist', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{add-physiotherapist}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#add-physiotherapist}}
      template block text
    {{/add-physiotherapist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
