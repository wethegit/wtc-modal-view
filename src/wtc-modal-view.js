import _u from 'wtc-utility-helpers';

/**
 * A Modal class which can display programatically-generated content, or pull in content from an existing DOM node.
 *
 * @static
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 1.2.4
 * @requirements wtc-utility-helpers
 * @created Nov 23, 2016
 */
class Modal {
  /**
   * @param {Object} [options={}] - List of options
   * @param {string} [options.closeHtml='<span>Close</span>'] - HTML to be inserted inside the close button
   * @param {string} [options.optionalClass] - Class to be added to the modal for custom styling
   * @param {function} [options.onOpen] - A function to be called when the modal opens
   * @param {function} [options.onClose] - A function to be called when the modal closes
   * @example
   * const myModal = new Modal();
   */
  constructor(options = {}) {
    // state = open or closed
    const { closeHtml, optionalClass, onOpen, onClose } = options || null;
    
    this.state = false;
    this.modal = document.createElement('div');
    this.modalOverlay = document.createElement('div');
    this.modalFocusStart = document.createElement('div');
    this.modalFocusEnd = document.createElement('div');
    this.modalClose = document.createElement('button');
    this.modalClose.innerHTML = closeHtml || '<span>Close</span>';
    this.modalWrapper = document.createElement('div');
    this.modalContent = document.createElement('div');
    this.className = 'modal';
    this.classNameOpen = 'modal--open';
    this.appended = false;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.focusOnClose = null;

    // add the classes and focus attributes
    this.modal.classList.add(this.className);
    if (optionalClass) this.modal.classList.add(optionalClass);
    this.modalOverlay.classList.add(`${this.className}__overlay`);
    this.modalFocusStart.classList.add(`${this.className}__focus-start`);
    this.modalFocusEnd.classList.add(`${this.className}__focus-end`);
    this.modalClose.classList.add(`${this.className}__close`);
    this.modalWrapper.classList.add(`${this.className}__wrapper`);
    this.modalContent.classList.add(`${this.className}__content`);

    // adds role of dialog for a11y
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
    this.modal.setAttribute("role", "dialog");

    this.modalFocusStart.setAttribute('tabindex', -1);
    this.modalFocusEnd.setAttribute('tabindex', 0);
    
    // create the markup structure
    this.modalWrapper.appendChild(this.modalFocusStart);
    this.modalWrapper.appendChild(this.modalClose);
    this.modalWrapper.appendChild(this.modalContent);
    this.modalWrapper.appendChild(this.modalFocusEnd);
    this.modal.appendChild(this.modalOverlay);
    this.modal.appendChild(this.modalWrapper);
    
    this.modalFocusEnd.addEventListener('focus', this.focusFirstElement.bind(this));
    this.modalClose.addEventListener('click', this.close.bind(this));
    this.modalOverlay.addEventListener('click', this.close.bind(this));
  }

  /**
   * Closes modal, removes content and optional class,
   * and shifts user focus back to triggering element, if specified.
   */
  close() {
    if(this.state) {
      this.modal.classList.remove(this.classNameOpen);
      
      // if a focusOnClose element was passed in when the modal opened, focus it!
      if (this.focusOnClose) {
        // check if the element is in fact focusable
        if (this.focusOnClose instanceof HTMLButtonElement ||
            this.focusOnClose.getAttribute('tabindex') ||
            this.focusOnClose instanceof HTMLAnchorElement) {
          this.focusOnClose.focus();
          this.focusOnClose = null;
        } else {
          console.error('focusOnClose element must be a focusable alement, or must have a tabindex attribute.');
        }
      }

      // This gives us time to animate and transition
      setTimeout(() => {
        this.state = false;
      }, 500);
      
      if (Modal.hash) {
        history.replaceState("", document.title, window.location.pathname);
      }

      if (this.onClose) {
        this.onClose();
      }
      
      _u.fireCustomEvent('wtc-modal-close', { modal: this });
    }
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
   * 
   * @example
   * const myModal = new Modal({ optionalClass: 'test-modal-class' });
   * const triggerButton = document.querySelector('trigger');
   * const testContent = '<p>Some sample content!</p>';
   * 
   * triggerButton.addEventListener('click', () => {
   *   // Passing `this` as the third argument sets our trigger as the focused item once the Modal closes.
   *   myModal.open(testContent, this);
   * });
   * 
   * @param {string|HTMLElement} content - String or DOMNode to be added as the modal content.
   * @param {HTMLElement} [focusOnClose] - Element which will receive focus after the modal is closed. Typically, this will be the element which triggered the modal in the first place.
   */
  open(content, focusOnClose) {
    if(!this.state) {
      document.body.appendChild(this.modal);
      
      if(content) {
        if (typeof content == 'string') {
          this.modalContent.innerHTML = content;
        } else {
          this.modalContent.appendChild(content);
        }
        
        if (focusOnClose && focusOnClose instanceof HTMLElement) {
          this.focusOnClose = focusOnClose;
        }
      }

      // This is here to avoid a flash of content for the first time
      let delay = this.appended ? 0 : 100;
      if (!this.appended) this.appended = true;
      setTimeout(()=> {
        this.modal.classList.add(this.classNameOpen);
      }, delay);

      this.state = true;
      
      this.focusFirstElement();

      if (this.onOpen) this.onOpen();

      const onKeyDown = (e) => {
        if (e.keyCode == 27) {
          this.close();
          document.removeEventListener('keydown', onKeyDown.bind(this), false);
        }
      }
      
      document.addEventListener('keydown', onKeyDown.bind(this), false);

      _u.fireCustomEvent('wtc-modal-open', { modal: this });
    }
  }

  /**
   * Shifts focus to the very beginning of the modal element—just before the close button.
   * @static
   */
  focusFirstElement() {
    this.modalFocusStart.focus();
  }
}

export default Modal;