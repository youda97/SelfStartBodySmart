import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('physio-welcome', 'Integration | Component | physio welcome', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{physio-welcome}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#physio-welcome}}
      template block text
    {{/physio-welcome}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
