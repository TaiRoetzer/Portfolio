class ScrollHandler {
  constructor({ decoration, header }) {
    this.clientHeight = 0;
    this.positionY = 0;
    this.scrollHeight = 0;
    this.showDecoration = false;
    this.showHeader = false;

    // Handled Elements
    this.decoration = document.getElementsByClassName(decoration)[0];
    this.header = document.getElementsByTagName(header)[0];

    this.initialize();
  }

  get decorationTopPercentage() {
    const normalized = this.positionY / this.scrollHeight;
    return (normalized * ScrollHandler.CONSTANTS.TOP_SCALAR) - ScrollHandler.CONSTANTS.TOP_INITIAL;
  }

  get resizeHandlerEvent() {
    return (event) => { this.updateSize(event); };
  }

  get scrollHandlerEvent() {
    return (event) => { this.updateScroll(event); };
  }

  destroy() {
    window.removeEventListener(ScrollHandler.CONSTANTS.EVENT_SCROLL, this.scrollHandlerEvent);
  }

  initialize() {
    window.addEventListener(ScrollHandler.CONSTANTS.EVENT_SCROLL, this.scrollHandlerEvent);
    window.addEventListener(ScrollHandler.CONSTANTS.EVENT_RESIZE, this.resizeHandlerEvent);

    this.updateSize();
    this.updateScroll();
  }

  updateScroll() {
    const { scrollY } = window;

    this.showHeader = scrollY < this.positionY;

    this.positionY = scrollY;

    this.updateElements();
  }

  updateSize() {
    const { innerHeight } = window;
    const { clientHeight } = window.document.documentElement;

    if (clientHeight === this.clientHeight) {
      return;
    }

    this.clientHeight = clientHeight;

    this.scrollHeight = innerHeight - clientHeight;

    this.updateScroll();
  }

  updateElements() {
    console.log(this.showHeader);
    this.header.setAttribute('data-hidden', `${!this.showHeader}`);
    this.decoration.setAttribute('data-hidden', `${this.showDecoration}`);
    this.decoration.setAttribute('style', `transform: translate(0, ${this.decorationTopPercentage}%);`);
  }

  static get CONSTANTS() {
    return {
      EVENT_RESIZE: 'resize',
      EVENT_SCROLL: 'scroll',
      TOP_SCALAR: 20,
      TOP_INITIAL: -10
    };
  }
}
