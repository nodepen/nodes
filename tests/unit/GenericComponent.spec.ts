import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import GenericComponent from './../../src/models/components/GenericComponent';
import Resthopper from 'resthopper';

describe('given a generic component', () => {
  it('calls local draw function', () => {
    const c = new GenericComponent(Resthopper.ComponentIndex.createComponent('Absolute'));
    c.draw();
  })
})
