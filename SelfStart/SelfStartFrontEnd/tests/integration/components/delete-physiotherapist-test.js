import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('delete-physiotherapist', 'Integration | Component | delete physiotherapist', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{delete-physiotherapist}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#delete-physiotherapist}}
      template block text
    {{/delete-physiotherapist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
