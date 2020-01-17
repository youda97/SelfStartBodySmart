import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ask-a-physio', 'Integration | Component | ask a physio', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ask-a-physio}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ask-a-physio}}
      template block text
    {{/ask-a-physio}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
