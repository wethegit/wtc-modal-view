/**
 * A Modal class which can display programatically-generated content, or pull in content from an existing DOM node.
 *
 * @example
 * const myModal = new Modal();
 * const triggerButton = document.querySelector('trigger');
 *
 * myModal.optionalClass = "modal--myModal";
 * myModal.content = '<p>Some sample content!</p>';
 * myModal.focusOnClose = triggerButton;
 *
 * triggerButton.addEventListener('click', () => {
 *   myModal.open();
 * });
 */
class Modal {
  constructor() {
    this.state = false;
    this.modal = document.createElement("div");
    this.modalOverlay = document.createElement("div");
    this.modalFocusStart = document.createElement("div");
    this.modalFocusEnd = document.createElement("div");
    this.modalClose = document.createElement("button");
    this.modalClose.innerHTML = "<span>Close</span>";
    this.modalWrapper = document.createElement("div");
    this.modalContent = document.createElement("div");
    this.wrapperOfContent = document.createElement("div");
    this.className = "modal";
    this.classNameOpen = "modal--open";
    this.appended = false;
    this.storeContent = false;

    // getters and setters variables
    this._onOpen = null;
    this._onClose = null;
    this._focusOnClose = null;
    this._content = null;

    // add the classes and focus attributes
    this.modal.classList.add(this.className);
    this.modalOverlay.classList.add(`${this.className}__overlay`);
    this.modalFocusStart.classList.add(`${this.className}__focus-start`);
    this.modalFocusEnd.classList.add(`${this.className}__focus-end`);
    this.modalClose.classList.add(`${this.className}__close`);
    this.modalWrapper.classList.add(`${this.className}__wrapper`);
    this.modalContent.classList.add(`${this.className}__content`);
    this.wrapperOfContent.classList.add(`${this.className}-content-wrapper`);

    // adds role of dialog for a11y
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
    this.modal.setAttribute("role", "dialog");

    this.modalFocusEnd.setAttribute("tabindex", 0);
    this.modalFocusStart.setAttribute("tabindex", 0);
    this.modalContent.setAttribute("tabindex", -1);

    // create the markup structure
    this.modalWrapper.appendChild(this.modalFocusStart);
    this.modalWrapper.appendChild(this.modalClose);
    this.modalWrapper.appendChild(this.modalContent);
    this.modalWrapper.appendChild(this.modalFocusEnd);
    this.modal.appendChild(this.modalOverlay);
    this.modal.appendChild(this.modalWrapper);

    document.body.appendChild(this.wrapperOfContent);

    this.modalFocusEnd.addEventListener("focus", () => {
      this.modalClose.focus();
    });

    this.modalFocusStart.addEventListener(
      "focus",
      this.focusLastElement.bind(this)
    );

    this.modalClose.addEventListener("click", this.close.bind(this));
    this.modalOverlay.addEventListener("click", this.close.bind(this));
  }

  /**
   * Closes modal, removes content and optional class,
   * and shifts user focus back to triggering element, if specified.
   */
  close() {
    if (this.state) {
      this.modal.classList.remove(this.classNameOpen, this.optionalClass);

      // if a focusOnClose element was passed in when the modal opened, focus it!
      if (this.focusOnClose) this.focusOnClose.focus();

      // This gives us time to animate and transition
      setTimeout(() => {
        this.state = false;
      }, 500);

      if (Modal.hash)
        history.replaceState("", document.title, window.location.pathname);

      if (this.onClose) this.onClose();
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
    } else {
      return null;
    }
  }

  /**
   * Opens modal, adds content and optional CSS class
   */
  open() {
    if (!this.state) {
      this.modal.classList.add(this.optionalClass);
      document.body.appendChild(this.modal);

      // This is here to avoid a flash of content for the first time
      let delay = this.appended ? 0 : 100;
      if (!this.appended) this.appended = true;
      setTimeout(() => {
        this.modal.classList.add(this.classNameOpen);
        this.focusFirstElement();
      }, delay);

      this.state = true;

      if (this.onOpen) this.onOpen();

      const onKeyDown = e => {
        if (e.keyCode == 27) {
          this.close();
          document.removeEventListener("keydown", onKeyDown.bind(this), false);
        }
      };

      document.addEventListener("keydown", onKeyDown.bind(this), false);
    }
  }

  /**
   * Shifts focus to the first element inside the content
   */
  focusFirstElement() {
    // traverse tree down
    const findFirst = function(parent) {
      if (!parent.firstElementChild) return parent;

      return findFirst(parent.firstElementChild);
    };

    let finalElement = findFirst(this.modalContent.firstElementChild);
    finalElement.setAttribute("tabindex", -1);
    finalElement.focus();
  }

  /**
   * Shifts focus to the last element inside the content
   */
  focusLastElement() {
    // traverse tree down
    const findFinal = function(parent) {
      if (!parent.lastElementChild) return parent;
      return findFinal(parent.lastElementChild);
    };

    let finalElement = findFinal(this.modalContent.lastElementChild);
    finalElement.setAttribute("tabindex", -1);
    finalElement.focus();
  }

  /**
   * Gets the element that will be focused when the modal closes
   *
   * @return {HTMLElement}
   */
  get focusOnClose() {
    return this._focusOnClose;
  }

  /**
   * Sets the element that will be focused when the modal closes
   *
   * @param {HTMLElement} element Must be a focusable element
   */
  set focusOnClose(element) {
    if (
      !element instanceof HTMLButtonElement &&
      !element instanceof HTMLAnchorElement &&
      !element.getAttribute("tabindex")
    )
      return;

    this._focusOnClose = element;
  }

  /**
   * Gets the function that is called when the modal opens
   *
   * @return {Function}
   */
  get onOpen() {
    return this._onOpen;
  }

  /**
   * Sets the function that is called when the modal opens
   *
   * @param {Function} callback
   */
  set onOpen(callback) {
    if (!callback || typeof callback !== "function") return;
    this._onOpen = callback;
  }

  /**
   * Get the function that is called when the modal closes
   *
   * @return {Function}
   */
  get onClose() {
    return this._onClose;
  }

  /**
   * Sets the function that is called when the modal closes
   *
   * @param {Function} callback
   */
  set onClose(callback) {
    if (!callback || typeof callback !== "function") return;
    this._onClose = callback;
  }

  /**
   * Sets an optional class name on the modal for custom styling
   *
   * @param {string} className
   */
  set optionalClass(className) {
    if (!className || typeof className !== "string") return;

    this._optionalClass = className;
  }

  /**
   * Gets the optional class name
   *
   * @param {string} optionalClass
   */
  get optionalClass() {
    return this._optionalClass || "";
  }

  /**
   * Sets the content of the close button, useful for localizing
   *
   * @param {string|HTMLElement} content
   */
  set closeButtonContent(content) {
    if (!content) return;

    if (typeof content === "string") {
      this.modalClose.innerHTML = content;
      return;
    }

    if (content instanceof HTMLElement) {
      this.modalClose.innerHTML = "";
      this.modalClose.appendChild(content);
      return;
    }
  }

  /**
   * Sets the content of the modal
   *
   * @param {string|HTMLElement} content
   */
  set content(content) {
    if (!content) return;

    if (typeof content !== "string" && !content instanceof HTMLElement) return;

    if (this.storeContent) this.wrapperOfContent.appendChild(this._content);

    this._content = content;

    if (typeof content === "string") {
      this.storeContent = false;
      this.modalContent.innerHTML = this._content;
    } else {
      this.storeContent = true;
      this.modalContent.innerHTML = "";
      this.modalContent.appendChild(this._content);
      return;
    }
  }
}

export default Modal;
