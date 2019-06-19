import _u from 'wtc-utility-helpers';

let instance = null;

/**
 * A Modal class which can display programatically-generated content, or pull in content from an existing DOM node.
 *
 * @static
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 1.2.3
 * @requirements wtc-utility-helpers
 * @created Nov 23, 2016
 */
class Modal {
  /**
   * Creates base DOM element.
   * @example
   * const Modal = new Modal();
   * 
   * @returns {Class} The Modal instance
   */
  constructor() {
    if (instance) {
      return instance;
    }

    // state = open or closed
    this.state = false;
    this.modal = document.createElement('div');
    this.modalOverlay = document.createElement('div');
    this.modalFocusStart = document.createElement('div');
    this.modalFocusEnd = document.createElement('div');
    this.modalClose = document.createElement('button');
    this.modalClose.innerHTML = '<span>Close</span>';
    this.modalWrapper = document.createElement('div');
    this.modalContent = document.createElement('div');
    this.className = 'modal';
    this.classNameOpen = 'modal--open';
    this.optionalClass = null;
    this.appended = false;
    this.onOpen = null;
    this.onClose = null;

    // add the classes and focus attributes
    this.modal.classList.add(this.className);
    this.modalOverlay.classList.add(`${this.className}__overlay`);
    this.modalFocusStart.classList.add(`${this.className}__focus-start`);
    this.modalFocusEnd.classList.add(`${this.className}__focus-end`);
    this.modalClose.classList.add(`${this.className}__close`);
    this.modalWrapper.classList.add(`${this.className}__wrapper`);
    this.modalContent.classList.add(`${this.className}__content`);

    this.modalFocusStart.setAttribute('tabindex', -1);
    this.modalFocusEnd.setAttribute('tabindex', 0);
    
    // create the markup structure
    this.modalWrapper.appendChild(this.modalFocusStart);
    this.modalWrapper.appendChild(this.modalClose);
    this.modalWrapper.appendChild(this.modalContent);
    this.modalWrapper.appendChild(this.modalFocusEnd);
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
   * Closes modal, removes content and optional class,
   * and shifts user focus back to triggering element, if specified.
   * @static
   * @return {Class} Modal instance.
   */
  static close() {
    const modal = Modal.instance;

    if(modal.state) {
      modal.modal.classList.remove(modal.classNameOpen);
      
      // if a focusOnClose element was passed in when the modal opened, focus it!
      if (modal.focusOnClose) {
        // check if the element is in fact focusable
        if (modal.focusOnClose instanceof HTMLButtonElement ||
            modal.focusOnClose.getAttribute('tabindex') ||
            modal.focusOnClose instanceof HTMLAnchorElement) {
          modal.focusOnClose.focus();
        } else {
          console.error('focusOnClose element must be a focusable alement, or must have a tabindex attribute.');
        }
      }

      // This gives us time to animate and transition
      setTimeout(() => {
        if (modal.optionalClass) {
          modal.modal.classList.remove(modal.optionalClass);
          modal.optionalClass = null;
        }

        modal.state = false;
        modal.modalContent.innerHTML = '';
      }, 500);
      
      modal.modalFocusEnd.removeEventListener('focus', Modal.focusFirstElement);

      if (Modal.hash) {
        history.replaceState("", document.title, window.location.pathname);
      }

      if (modal.onClose) {
        modal.onClose();
      }
      _u.fireCustomEvent('wtc-modal-close', { modal: this });
    }

    return modal;
  }

  /**
   * Get current url hash
   * @static
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
   * Opens modal, adds content and optional CSS class
   * @static
   * 
   * @example
   * const triggerButton = document.querySelector('trigger');
   * const testContent = '<p>Some sample content!</p>';
   * 
   * triggerButton.addEventListener('click', () => {
   *   // Passing `this` as the third argument sets our trigger as the focused item once the Modal closes.
   *   Modal.open(testContent, 'test-modal-class', this);
   * });
   * 
   * @param {string|HTMLElement} content - String or DOMNode to be added as the modal content.
   * @param {string} optionalClass - Optional CSS class to add to the modal element.
   * @param {HTMLElement} [focusOnClose] - Element which will receive focus after the modal is closed. Typically, this will be the element which triggered the modal in the first place.
   *
   * @return {Class} Modal instance
   */
  static open(content, optionalClass, focusOnClose) {
    const modal = Modal.instance;

    if(!modal.state) {
      if(content) {
        if (typeof content == 'string') {
          modal.modalContent.innerHTML = content;
        } else {
          modal.modalContent.appendChild(content);
        }
        
        if (focusOnClose && focusOnClose instanceof HTMLElement) {
          modal.focusOnClose = focusOnClose;
        }
      }

      if (optionalClass) {
        modal.modal.classList.add(optionalClass);
        modal.optionalClass = optionalClass;
      }

      // This is here to avoid a flash of content for the first time
      let delay = modal.appended ? 0 : 100;
      if (!modal.appended) modal.appended = true;
      setTimeout(()=> {
        modal.modal.classList.add(modal.classNameOpen);
      }, delay);

      modal.state = true;
      
      Modal.focusFirstElement();

      if (modal.onOpen) modal.onOpen();

      this.onKeyDown = (e) => {
        if (e.keyCode == 27) {
          Modal.close();
          document.removeEventListener('keydown', this.onKeyDown, false);
        }
      }
      document.addEventListener('keydown', this.onKeyDown, false);
      modal.modalFocusEnd.addEventListener('focus', Modal.focusFirstElement);

      _u.fireCustomEvent('wtc-modal-open', { modal: this });
    }

    return modal;
  }

  /**
   * Sets a callback to run when the modal opens
   * @static
   * @param {Function} callback - Callback function
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
   * Sets a callback to run when the modal closes
   * @static
   * @param {Function} callback - Callback function
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
  
  /**
   * Shifts focus to the very beginning of the modal element—just before the close button.
   * @static
   */
  static focusFirstElement() {
    Modal.instance.modalFocusStart.focus();
  }

  /**
   * Gets the modal DOM element
   * @return {HTMLElement}
   */
  static get modal() {
    return this.instance.modal;
  }

  /**
   * Gets the modal content DOM element
   * @return {HTMLElement}
   */
  static get modalContent() {
    return this.instance.modalContent;
  }

  /**
   * Gets the main Modal instance
   * @return {Class}
   */
  static get instance() {
    if(!instance) {
      instance = new Modal();
    }

    return instance;
  }
}

export default Modal;