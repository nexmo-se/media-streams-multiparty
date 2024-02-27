// @flow
import LM from 'opentok-layout-js';
import { isMobile } from '../util';

class LayoutManager {
  constructor(container, manager) {
    this.container = container;
    this.manager = manager;
  }

  init() {
    const element = document.getElementById(this.container);
    if (element)
      this.manager = LM(element, {
        fixedRatio: false,
        alignItems: 'center',
        bigPercentage: 0.8,
        bigFixedRatio: false,
        bigAlignItems: 'center',
        smallAlignItems: 'center',
        maxRatio: isMobile() ? 16 / 9 : 14 / 16,
        minRatio: isMobile() ? 3 / 2 : 9 / 16,
        maxWidth: Infinity,
        maxHeight: Infinity,
        smallMaxWidth: Infinity,
        smallMaxHeight: Infinity,
        bigMaxWidth: Infinity,
        bigMaxHeight: Infinity,
        bigMaxRatio: 3 / 2,
        bigMinRatio: 9 / 16,
        bigFirst: true,
      });
    else throw new Error('Cannot find container');
  }

  layout() {
    if (!this.manager) this.init();
    this.manager.layout();
  }
}
export default LayoutManager;
