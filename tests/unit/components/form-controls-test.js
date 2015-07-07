import { moduleForComponent, test } from 'ember-qunit';

let component;

moduleForComponent('form-controls', 'Unit | Component | form controls', {
  unit: true,

  beforeEach: function() {
    component = this.subject();
  },
});

test('it renders', function(assert) {

  assert.equal(component._state, 'preRender',
    'The component instance should be created');

  this.render();

  assert.equal(component._state, 'inDOM',
    'The component should be inserted into the DOM after render');
});