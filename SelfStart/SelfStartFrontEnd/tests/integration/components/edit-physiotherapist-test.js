import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-physiotherapist', 'Integration | Component | edit physiotherapist', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{edit-physiotherapist}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#edit-physiotherapist}}
      template block text
    {{/edit-physiotherapist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
