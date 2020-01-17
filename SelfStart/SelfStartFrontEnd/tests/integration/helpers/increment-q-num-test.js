
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('increment-q-num', 'helper:increment-q-num', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{increment-q-num inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

