import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('types-appointment', 'helper:types-appointment', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{types-appointment inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});
