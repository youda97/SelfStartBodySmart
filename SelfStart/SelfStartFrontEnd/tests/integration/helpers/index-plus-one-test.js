
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('index-plus-one', 'helper:index-plus-one', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{index-plus-one inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

