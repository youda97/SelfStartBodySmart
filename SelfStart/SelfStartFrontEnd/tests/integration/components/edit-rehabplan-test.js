import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-rehabplan', 'Integration | Component | edit rehabplan', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{edit-rehabplan}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#edit-rehabplan}}
      template block text
    {{/edit-rehabplan}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
