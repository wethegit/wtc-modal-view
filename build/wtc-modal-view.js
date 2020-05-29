"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
var Modal = /*#__PURE__*/function () {
  function Modal() {
    var _this = this;

    _classCallCheck(this, Modal);

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
    this.storeContent = false; // getters and setters variables

    this._onOpen = null;
    this._onClose = null;
    this._focusOnClose = null;
    this._content = null; // add the classes and focus attributes

    this.modal.classList.add(this.className);
    this.modalOverlay.classList.add("".concat(this.className, "__overlay"));
    this.modalFocusStart.classList.add("".concat(this.className, "__focus-start"));
    this.modalFocusEnd.classList.add("".concat(this.className, "__focus-end"));
    this.modalClose.classList.add("".concat(this.className, "__close"));
    this.modalWrapper.classList.add("".concat(this.className, "__wrapper"));
    this.modalContent.classList.add("".concat(this.className, "__content"));
    this.wrapperOfContent.classList.add("".concat(this.className, "-content-wrapper")); // adds role of dialog for a11y
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role

    this.modal.setAttribute("role", "dialog");
    this.modalFocusEnd.setAttribute("tabindex", 0);
    this.modalFocusStart.setAttribute("tabindex", 0);
    this.modalContent.setAttribute("tabindex", -1); // create the markup structure

    this.modalWrapper.appendChild(this.modalFocusStart);
    this.modalWrapper.appendChild(this.modalClose);
    this.modalWrapper.appendChild(this.modalContent);
    this.modalWrapper.appendChild(this.modalFocusEnd);
    this.modal.appendChild(this.modalOverlay);
    this.modal.appendChild(this.modalWrapper);
    document.body.appendChild(this.wrapperOfContent);
    this.modalFocusEnd.addEventListener("focus", function () {
      _this.modalClose.focus();
    });
    this.modalFocusStart.addEventListener("focus", this.focusLastElement.bind(this));
    this.modalClose.addEventListener("click", this.close.bind(this));
    this.modalOverlay.addEventListener("click", this.close.bind(this));
  }
  /**
   * Closes modal, removes content and optional class,
   * and shifts user focus back to triggering element, if specified.
   */


  _createClass(Modal, [{
    key: "close",
    value: function close() {
      var _this2 = this;

      if (this.state) {
        this.modal.classList.remove(this.classNameOpen, this.optionalClass); // if a focusOnClose element was passed in when the modal opened, focus it!

        if (this.focusOnClose) this.focusOnClose.focus(); // This gives us time to animate and transition

        setTimeout(function () {
          _this2.state = false; // Setting the modal to display: none; when closed, just to prevent anything from still being
          // focussable. Mainly the close button.

          _this2.modal.style.display = "none"; // On close, we taken the content from the modal and apply it to our static modal wrapper.
          // This prevents the content from stil being tabbable in the DOM.

          _this2.wrapperOfContent.appendChild(_this2._content);
        }, 500);
        if (Modal.hash) history.replaceState("", document.title, window.location.pathname);
        if (this.onClose) this.onClose();
      }
    }
    /**
     * Get current url hash
     * @static
     * @return {String} hash string or null if none.
     */

  }, {
    key: "open",

    /**
     * Opens modal, adds content and optional CSS class
     */
    value: function open() {
      var _this3 = this;

      if (!this.state) {
        this.modal.classList.add(this.optionalClass);
        document.body.appendChild(this.modal); // This is here to avoid a flash of content for the first time

        var delay = this.appended ? 0 : 100;
        if (!this.appended) this.appended = true; // Appending the content back to the modal.

        this.modalContent.append(this._content); // Setting the modal back to block.

        this.modal.style.display = "block";
        setTimeout(function () {
          _this3.modal.classList.add(_this3.classNameOpen);

          _this3.focusFirstElement();
        }, delay);
        this.state = true;
        if (this.onOpen) this.onOpen();

        var onKeyDown = function onKeyDown(e) {
          if (e.keyCode == 27) {
            _this3.close();

            document.removeEventListener("keydown", onKeyDown.bind(_this3), false);
          }
        };

        document.addEventListener("keydown", onKeyDown.bind(this), false);
      }
    }
    /**
     * Shifts focus to the first element inside the content
     */

  }, {
    key: "focusFirstElement",
    value: function focusFirstElement() {
      // traverse tree down
      var findFirst = function findFirst(parent) {
        if (!parent.firstElementChild) return parent;
        return findFirst(parent.firstElementChild);
      };

      var finalElement = findFirst(this.modalContent.firstElementChild);
      finalElement.setAttribute("tabindex", -1);
      finalElement.focus();
    }
    /**
     * Shifts focus to the last element inside the content
     */

  }, {
    key: "focusLastElement",
    value: function focusLastElement() {
      var focusableElements = this.modalContent.querySelectorAll('[href], button, [tabindex="0"], [role="button"]');

      if (focusableElements.length > 0) {
        var lastFocusableElement = focusableElements[focusableElements.length - 1];
        lastFocusableElement.focus();
      } else {
        this.modalClose.focus();
      }
    }
    /**
     * Gets the element that will be focused when the modal closes
     *
     * @return {HTMLElement}
     */

  }, {
    key: "focusOnClose",
    get: function get() {
      return this._focusOnClose;
    }
    /**
     * Sets the element that will be focused when the modal closes
     *
     * @param {HTMLElement} element Must be a focusable element
     */
    ,
    set: function set(element) {
      if (!element instanceof HTMLButtonElement && !element instanceof HTMLAnchorElement && !element.getAttribute("tabindex")) return;
      this._focusOnClose = element;
    }
    /**
     * Gets the function that is called when the modal opens
     *
     * @return {Function}
     */

  }, {
    key: "onOpen",
    get: function get() {
      return this._onOpen;
    }
    /**
     * Sets the function that is called when the modal opens
     *
     * @param {Function} callback
     */
    ,
    set: function set(callback) {
      if (!callback || typeof callback !== "function") return;
      this._onOpen = callback;
    }
    /**
     * Get the function that is called when the modal closes
     *
     * @return {Function}
     */

  }, {
    key: "onClose",
    get: function get() {
      return this._onClose;
    }
    /**
     * Sets the function that is called when the modal closes
     *
     * @param {Function} callback
     */
    ,
    set: function set(callback) {
      if (!callback || typeof callback !== "function") return;
      this._onClose = callback;
    }
    /**
     * Sets an optional class name on the modal for custom styling
     *
     * @param {string} className
     */

  }, {
    key: "optionalClass",
    set: function set(className) {
      if (!className || typeof className !== "string") return;
      this._optionalClass = className;
    }
    /**
     * Gets the optional class name
     *
     * @param {string} optionalClass
     */
    ,
    get: function get() {
      return this._optionalClass || "";
    }
    /**
     * Sets the content of the close button, useful for localizing
     *
     * @param {string|HTMLElement} content
     */

  }, {
    key: "closeButtonContent",
    set: function set(content) {
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

  }, {
    key: "content",
    set: function set(content) {
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
  }], [{
    key: "hash",
    get: function get() {
      var URLhash = /#\!?\/(.+)\//i.exec(window.location.hash);

      if (URLhash && URLhash.length > 1) {
        return URLhash[1];
      } else {
        return null;
      }
    }
  }]);

  return Modal;
}();

var _default = Modal;
exports["default"] = _default;