/**
 * Modal
 * Generic and static class to controll modal a modal.
 * It also contains two static helpers specific to nclood.
 *
 * @static
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 0.8
 * @requirements wtc-utility-helpers
 * @created Nov 23, 2016
 */

import _u from 'wtc-utility-helpers';

/**
 * Holds the one and only Modal instance
 * @type {Class}
 */
let instance = null;

class Modal {
  /**
   * Creates base dom element.
   * @return {Class} Modal instance.
   */
  constructor() {
    if (instance) {
      return instance;
    }

    this.state = false;
    this.modal = document.createElement('modal');
    this.modalOverlay = document.createElement('div');
    this.modalClose = document.createElement('button');
    this.modalClose.innerHTML = 'Close';
    this.modalWrapper = document.createElement('div');
    this.modalContent = document.createElement('div');
    this.className = 'modal';
    this.optionalClass = null;
    this.appended = false;
    this.onOpen = null;
    this.onClose = null;

    _u.addClass(this.className, this.modal);
    _u.addClass(`${this.className}__overlay`, this.modalOverlay);
    _u.addClass(`${this.className}__close`, this.modalClose);
    _u.addClass(`${this.className}__wrapper`, this.modalWrapper);
    _u.addClass(`${this.className}__content`, this.modalContent);

    this.modalWrapper.appendChild(this.modalClose);
    this.modalWrapper.appendChild(this.modalContent);

    this.modal.appendChild(this.modalOverlay);
    this.modal.appendChild(this.modalWrapper);

    document.body.appendChild(this.modal);

    instance = this;

    this.modalClose.addEventListener('click', (e) => {
      Modal.close();
    });

    this.modalOverlay.addEventListener('click', (e) => {
      Modal.close();
    });

    return this;
  }

  /**
   * Closes modal, removes content and optional class
   * @return {Class} Modal instance.
   */
  static close() {
    const modal = Modal.instance;

    if(modal.state) {
      _u.removeClass('is-open', modal.modal);

      // This gives us time to animate and transition
      setTimeout(() => {
        if (modal.optionalClass) {
          _u.removeClass(modal.optionalClass, modal.modal);
          modal.optionalClass = null;
        }

        modal.state = false;
        modal.modalContent.innerHTML = '';
      }, 500);

      if (Modal.hash) {
        history.replaceState("", document.title, window.location.pathname);
      }

      if (modal.onClose) {
        modal.onClose();
      }
    }

    return modal;
  }

  /**
   * Get current url hash
   * @return {String} hash string or null if none.
   */
  static get hash() {
    let URLhash = /#\!?\/(.+)\//i.exec(window.location.hash);
    if (URLhash && URLhash.length > 1) {
      return URLhash[1];
    }
    else {
      return null;
    }
  }

  /**
   * Opens modal, add content and optional class
   * @param {string|DOMNode} content       - String or DOMNode to be added to modal content.
   * @param {string}         optionalClass - Optional class to be added to modal
   *
   * @return {Class} Modal instance
   */
  static open(content, optionalClass) {
    const modal = Modal.instance;

    if(!modal.state) {
      if(content) {
        if (typeof content == 'string') {
          modal.modalContent.innerHTML = content;
        } else {
          modal.modalContent.appendChild(content);
        }
      }

      if (optionalClass) {
        _u.addClass(optionalClass, modal.modal);
        modal.optionalClass = optionalClass;
      }

      // This is here so avoid a flash of content for the first time
      if (!modal.appended) {
        modal.appended = true;

        setTimeout(()=> {
          _u.addClass('is-open', modal.modal);
        }, 100);
      } else {
        _u.addClass('is-open', modal.modal);
      }

      modal.state = true;

      if (modal.onOpen) {
        modal.onOpen();
      }
    }

    return modal;
  }

  /**
   * Open retailer content inside modal
   * @param {DOMNode} retailer - Retailer node.
   *
   * @return {Class} Modal instance
   */
  static openRetailer(retailer = null) {
    if (retailer) {
      Modal.open(retailer, 'modal--retailer');
    }
  }

  /**
   * Open nclood video inside modal.
   *
   * @param {Object} options Video options. http://share.nintendo.com/nclood/stable/docs/#Video
   * @param {Number} ratio   Ratio of the video.
   * @param {Number} aspect  Aspect of the video.
   *
   * @return {Class} Modal instance.
   */
  static openVideo(options = {}, ratio = 0.85, aspect = 16 / 9) {
    const modal = Modal.instance;
    let contentWrapper = modal.modalContent;
    let wrapper = document.createElement('div');

    let cs = getComputedStyle(contentWrapper);

    let paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    let borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    let elementWidth = contentWrapper.offsetWidth - paddingX - borderX;


    let width = options.width || elementWidth;
    let maxheight = window.innerHeight * ratio;

    if (width > document.body.clientWidth * ratio) {
      width = document.body.clientWidth * ratio;
    }

    let height = width / aspect;

    if (maxheight + 100 > window.innerHeight) {
      maxheight = maxheight - 80;
    }

    if (height > maxheight) {
      height = maxheight;
      width = maxheight * aspect;
    }

    let settings = _u.extend({
      target: wrapper,
      videoId: null,
      name: '',
      autoplay: true,
      width: width,
      height: height,
      chromeless: true
    }, options);

    contentWrapper.appendChild(wrapper);
    var video = new nclood.Video(settings);

    if (options.hash) {
      window.location.hash = `!/${options.hash}/`;
    }

    Modal.open(null, 'modal--video');

    return modal;
  }

  /**
   * Sets a callback for when the modal opens
   * @param {Function} callback - Callback function
   *
   * @return {Class} Modal instance
   */
  static set onOpen(callback = null) {
    if (typeof callback == 'function') {
      this.instance.onOpen = callback;
    } else {
      throw 'Must be a function';
    }

    return this.instance;
  }

  /**
   * Sets a callback for when the modal closes
   * @param {Function} callback - Callback function
   *
   * @return {Class} Modal instance
   */
  static set onClose(callback = null) {
    if (typeof callback == 'function') {
      this.instance.onClose = callback;
    } else {
      throw 'Must be a function';
    }

    return this.instance;
  }

  static get modal(){
    return this.instance.modal;
  }

  static get modalContent(){
    return this.instance.modalContent;
  }

  /**
   * Main instance getter
   */
  static get instance() {
    if(!instance) {
      instance = new Modal();
    }

    return instance;
  }
}

export default Modal;
