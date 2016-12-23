'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

var _wtcUtilityHelpers = require('wtc-utility-helpers');

var _wtcUtilityHelpers2 = _interopRequireDefault(_wtcUtilityHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Holds the one and only Modal instance
 * @type {Class}
 */
var instance = null;

var Modal = function () {
  /**
   * Creates base dom element.
   * @return {Class} Modal instance.
   */
  function Modal() {
    var _this = this;

    _classCallCheck(this, Modal);

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

    _wtcUtilityHelpers2.default.addClass(this.className, this.modal);
    _wtcUtilityHelpers2.default.addClass(this.className + '__overlay', this.modalOverlay);
    _wtcUtilityHelpers2.default.addClass(this.className + '__close', this.modalClose);
    _wtcUtilityHelpers2.default.addClass(this.className + '__wrapper', this.modalWrapper);
    _wtcUtilityHelpers2.default.addClass(this.className + '__content', this.modalContent);

    this.modalWrapper.appendChild(this.modalClose);
    this.modalWrapper.appendChild(this.modalContent);

    this.modal.appendChild(this.modalOverlay);
    this.modal.appendChild(this.modalWrapper);

    this.modalClose.addEventListener('click', function (e) {
      _this.close();
    });

    this.modalOverlay.addEventListener('click', function (e) {
      _this.close();
    });

    document.body.appendChild(this.modal);

    instance = this;
    return this;
  }

  /**
   * Closes modal, removes content and optional class
   * @return {Class} Modal instance.
   */


  _createClass(Modal, [{
    key: 'close',
    value: function close() {
      var modal = Modal.instance;

      if (modal.state) {
        _wtcUtilityHelpers2.default.removeClass('is-open', modal.modal);

        // This gives us time to animate and transition
        setTimeout(function () {
          if (modal.optionalClass) {
            _wtcUtilityHelpers2.default.removeClass(modal.optionalClass, modal.modal);
            modal.optionalClass = null;
          }

          modal.state = false;
          modal.modalContent.innerHTML = '';
        }, 500);

        if (modal.onClose) {
          modal.onClose();
        }
      }

      return modal;
    }

    /**
     * Opens modal, add content and optional class
     * @param {string|DOMNode} content       - String or DOMNode to be added to modal content.
     * @param {string}         optionalClass - Optional class to be added to modal
     *
     * @return {Class} Modal instance
     */

  }], [{
    key: 'open',
    value: function open(content, optionalClass) {
      var modal = Modal.instance;

      if (!modal.state) {
        if (content) {
          if (typeof content == 'string') {
            modal.modalContent.innerHTML = content;
          } else {
            modal.modalContent.appendChild(content);
          }
        }

        if (optionalClass) {
          _wtcUtilityHelpers2.default.addClass(optionalClass, modal.modal);
          modal.optionalClass = optionalClass;
        }

        // This is here so avoid a flash of content for the first time
        if (!modal.appended) {
          modal.appended = true;

          setTimeout(function () {
            _wtcUtilityHelpers2.default.addClass('is-open', modal.modal);
          }, 100);
        } else {
          _wtcUtilityHelpers2.default.addClass('is-open', modal.modal);
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

  }, {
    key: 'openRetailer',
    value: function openRetailer() {
      var retailer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

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

  }, {
    key: 'openVideo',
    value: function openVideo() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.85;
      var aspect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16 / 9;

      var modal = Modal.instance;
      var contentWrapper = modal.modalContent;
      var wrapper = document.createElement('div');
      var width = 784;
      var height = width / aspect;
      var maxheight = window.innerHeight * ratio;

      if (width > document.body.clientWidth * ratio) {
        width = document.body.clientWidth * ratio;
      }

      if (maxheight + 100 > window.innerHeight) {
        maxheight = maxheight - 80;
      }

      if (height > maxheight) {
        height = maxheight;
        width = maxheight * aspect;
      }

      var settings = _wtcUtilityHelpers2.default.extend({
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

      Modal.open(null, 'modal--video');

      return modal;
    }

    /**
     * Sets a callback for when the modal opens
     * @param {Function} callback - Callback function
     *
     * @return {Class} Modal instance
     */

  }, {
    key: 'onOpen',
    set: function set() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

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
    ,


    /**
     * Getters
     */
    get: function get() {
      return this.instance.onOpen;
    }
  }, {
    key: 'onClose',
    set: function set() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (typeof callback == 'function') {
        this.instance.onClose = callback;
      } else {
        throw 'Must be a function';
      }

      return this.instance;
    },
    get: function get() {
      return this.instance.onClose;
    }
  }, {
    key: 'modal',
    get: function get() {
      return this.instance.modal;
    }
  }, {
    key: 'modalContent',
    get: function get() {
      return this.instance.modalContent;
    }

    /**
     * Main instance getter
     */

  }, {
    key: 'instance',
    get: function get() {
      if (!instance) {
        instance = new Modal();
      }

      return instance;
    }
  }]);

  return Modal;
}();

exports.default = Modal;