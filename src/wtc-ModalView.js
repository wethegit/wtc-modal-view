/*
Modal View
=======================================
- *Author*          liamegan
- *email*           liam@wethecollective.com
- *Created*         2014-04-09 11:21:56
- *namespace*       wtc.utilities
- *Requirements*    jQuery
- *Description*     A minimal modal view.
- *Edited by*       scorpiolam
- *Edited*          2016-03-21 12:51:01
- *Version*         1.2
*/
; 'use strict';

(function()
{
  var _base, _base2, _base3;
  window.wtc || (window.wtc = {});
  (_base = window.wtc).utilities || (_base.utilities = {});
  (_base2 = window.wtc).CONST || (_base2.CONST = {});
  (_base3 = window.wtc.CONST).MODAL_ID || (_base3.MODAL_ID = 'ModalView');

  (function(NS)
  {

    NS.ModalView = (function()
    {
      function ModalView() {}
      ModalView.elementID = 'ModalView';
      ModalView.initialised = false;
      ModalView.modalDelay = 100;
      ModalView.useHandlebar = false;
      ModalView._getModalElementId = function() {
        var _base4;
        return (_base4 = window.wtc.CONST).MODAL_ID || (_base4.MODAL_ID = this.elementID);
      };
      ModalView._getModalTemplate = function() {
        var ID, template;
        ID = this._getModalElementId();
        return template = "        <div id='" + ID + "'>          <div data-canclose=\"true\" class=\"modal-container\">            <div class=\"modal-content\"></div>          </div>        </div>      ";
      };
      ModalView._getInnerTemplate = function() {
        return "        {{{MODALCONTENT}}}      ";
      };
      ModalView._parseTemplateHandlebar = function(template, variables) {
        if (template == null) {
          template = '';
        }
        if (variables == null) {
          variables = {};
        }
        template = Handlebars.compile(template);
        return template(variables);
      };
      ModalView._parseTemplate = function(template, variables) {
        var k, parsedString, v;
        if (template == null) {
          template = '';
        }
        if (variables == null) {
          variables = {};
        }
        parsedString = template;
        for (k in variables) {
          v = variables[k];
          parsedString = parsedString.replace("{{" + k + "}}", v);
        }
        return parsedString;
      };
      ModalView.clearVariables = function() {
        return this.template_vars = {};
      };
      ModalView.setVariable = function(name, value) {
        this.template_vars[name] = value;
      };
      ModalView.getTemplateVars = function() {
        return this.template_vars || (this.template_vars = {});
      };
      ModalView.open = function(content) {
        var contentarea, modal, s, _content;
        if (typeof content === 'string') {
          this.setVariable('MODALCONTENT', content);
        } else if (typeof content === 'object') {
          this.setVariable('MODALCONTENT', '<div class="modal-content"></div>');
        }
        modal = this.getModal();
        setTimeout(function() {
          return $(modal).addClass('is-open');
        }, this.modalDelay);
        s = modal.querySelector('.modal-container > .modal-content');
        if (typeof content === 'object' && content.nodeType) {
          contentarea = modal.querySelector('.modal-content .modal-content');
          _content = contentarea.appendChild(content);
        }
        return _content;
      };
      ModalView.getModal = function() {
        var ID, container, element, op, s, template;
        op = this;
        ID = this._getModalElementId();
        element = document.getElementById(ID) || document.body.appendChild(this._getModalTemplate);
        s = element.style;
        s.display = 'block';
        s.width = "" + document.body.clientWidth + "px";
        s.height = "" + window.innerHeight + "px";
        template = this._getInnerTemplate();
        if (template && typeof template === 'string') {
          if (this.useHandlebar) {
            template = this._parseTemplateHandlebar(template, this.getTemplateVars());
          } else {
            template = this._parseTemplate(template, this.getTemplateVars());
          }
          container = element.querySelector('.modal-content');
          container.innerHTML = template;
        }
        if (!this.initialised) {
          window.addEventListener('resize', function() {
            s.width = "" + window.innerWidth + "px";
            return s.height = "" + window.innerHeight + "px";
          });
          element.addEventListener('click', function(e) {
            if (e.target.getAttribute('data-canclose') === 'true') {
              return op.close();
            }
          });
          $(document).on('keyup.modal', function(e) {
            switch (e.which) {
              case 27:
                return op.close();
            }
          });
          this.initialised = true;
        }
        return element;
      };
      ModalView.close = function() {
        var ID, modal;
        ID = this._getModalElementId();
        modal = document.getElementById(ID) || document.body.appendChild(this._getModalTemplate);
        $(modal).removeClass('is-open');
        setTimeout(function() {
          var contentarea, element;
          contentarea = modal.querySelector('.modal-content .modal-content');
          contentarea.innerHTML = '';
          element = document.getElementById(ID);
          return element.style.display = 'none';
        }, this.modalDelay);
      };
      return ModalView;
    })();
    NS.VideoModal = (function() {
      __extends(VideoModal, NS.ModalView);
      function VideoModal() {
        VideoModal.__super__.constructor.apply(this, arguments);
      }
      VideoModal.ratio = 0.85;
      VideoModal.aspect = 16 / 9;
      VideoModal.default_aspect = VideoModal.aspect;
      VideoModal.width = VideoModal.height * VideoModal.aspect;
      VideoModal.attrs = {};
      try {
        VideoModal.video = Object.create(OVPplayer);
      } catch (e) {
        VideoModal.video = null;
      }
      VideoModal._getInnerTemplate = function() {
        var closeCopy;
        closeCopy = (function() {
          switch (window.wtc.CONST.LANGUAGE) {
            case 'fr':
              return 'Fermer';
            case 'es':
              return 'Cerrar';
            default:
              return 'Close';
          }
        })();
        return "        <div class='container'>            <div class=\"modal-close\" data-canclose=\"true\">" + closeCopy + "</div>            <div class=\"modal-video content\">                {{MODALCONTENT}}            </div>        </div>      ";
      };
      VideoModal.createVideo = function(_config) {
        var config, video_dimensions;
        if (this.video === null) {
          return;
        }
        video_dimensions = this.getVideoDimensions();
        config = {
          target: null,
          embedCode: null,
          autoplay: true,
          chromeless: false,
          wmode: 'transparent',
          color: 'wiiu',
          dontreplace: true,
          width: video_dimensions[0] + 'px',
          height: video_dimensions[1] + 'px'
        };
        config = NS.WTCObj.deepExtend({}, config, _config);
        this.video.insert(config);
        return this.video;
      };
      VideoModal.getVideoHeight = function() {
        return this.getVideoWidth() / this.aspect;
      };
      VideoModal.getVideoWidth = function() {
        var w;
        w = 784;
        if (w > document.body.clientWidth * this.ratio) {
          w = document.body.clientWidth * this.ratio;
        }
        return w;
      };
      VideoModal.getVideoMaxWidth = function() {
        return window.innerWidth * this.ratio;
      };
      VideoModal.getVideoMaxHeight = function() {
        var max;
        max = window.innerHeight * this.ratio;
        if (max + 100 > window.innerHeight) {
          return max - 80;
        }
        return max;
      };
      VideoModal.getVideoDimensions = function() {
        var height, maxheight, width;
        width = height = 0;
        width = this.getVideoWidth();
        height = this.getVideoHeight();
        maxheight = this.getVideoMaxHeight();
        if (height > maxheight) {
          height = maxheight;
          width = maxheight * this.aspect;
        }
        return [width, height];
      };
      VideoModal.open = function(id, _config) {
        var config, modal, s, videoConfig, video_dimensions, vidplayer;
        if (_config == null) {
          _config = {};
        }
        video_dimensions = this.getVideoDimensions();
        vidplayer = document.createElement('div');
        s = vidplayer.style;
        s.width = "" + video_dimensions[0] + "px";
        s.height = "" + video_dimensions[1] + "px";
        s.overflow = "hidden";
        s.background = '#000';
        vidplayer.id = 'NIN_VID';
        modal = VideoModal.__super__.open.call(this, vidplayer);
        videoConfig = {
          target: "#NIN_VID",
          embedCode: id
        };
        config = NS.WTCObj.deepExtend({}, videoConfig, _config);
        this.createVideo(config);
        $('body').addClass('modal-open');
      };
      VideoModal.setupVideoButtons = function() {
        var anchor, anchors, cl, handler, op, _i, _len, _results;
        op = this;
        anchors = document.querySelectorAll('a.video');
        handler = function(e) {
          op.clickHandler(e, this);
          e.preventDefault();
          return false;
        };
        _results = [];
        for (_i = 0, _len = anchors.length; _i < _len; _i++) {
          anchor = anchors[_i];
          cl = anchor.className;
          if (cl.indexOf('modal') !== -1) {
            continue;
          }
          anchor.className = cl + ' modal';
          _results.push(anchor.addEventListener('click', handler));
        }
        return _results;
      };
      VideoModal.openByID = function(id) {
        var videoid, _base4;
        try {
          if (!id || typeof id !== 'string') {
            throw new error('No Video ID supplied');
          }
          this.aspect = (_base4 = window.wtc.CONST.VIDEOS_R)[id] || (_base4[id] = this.default_aspect);
          videoid = window.wtc.CONST.VIDEOS[id];
          if (!videoid) {
            throw new error('No Video ID found');
          }
        } catch (err) {
          console.warn(err);
        }
        window.location.hash = "!/" + (id.toLowerCase()) + "/";
        this.open(videoid);
      };
      VideoModal.clickHandler = function(e, a) {
        var videoid;
        try {
          videoid = a.getAttribute("data-videoid");
          if (!videoid) {
            throw new error('The clicked video player anchor does not contain a video ID');
          }
        } catch (err) {
          console.warn(err);
        }
        this.openByID(videoid);
      };
      VideoModal.close = function() {
        if (this.video === null) {
          VideoModal.__super__.close.apply(this, arguments);
          return;
        }
        history.pushState("", document.title, window.location.pathname);
        $('body').removeClass('modal-open');
        this.video.destroy();
        VideoModal.__super__.close.apply(this, arguments);
      };
      return VideoModal;
    })();
    return NS.ModalController = (function() {
      function ModalController() {}
      ModalController.modal = NS.VideoModal;
      ModalController.attrName = null;
      ModalController.init = function(attrName) {
        var hash, _this;
        this.attrName = attrName;
        _this = this;
        $("[data-" + attrName + "]").on('click', function(e) {
          _this.openVideoOnClick(this);
          return e.preventDefault();
        });
        hash = /#\!?\/(.+)\//i.exec(window.location.hash);
        if (hash && hash.length > 1) {
          if ($('#' + hash[1]).attr('data-videoid')) {
            hash = hash[1];
            return this.openVideoOnClick("#" + hash);
          }
        }
      };
      ModalController.openVideoOnClick = function(element) {
        var n, name, name_bits, op, videoid, _i, _len, _ref;
        op = $(element);
        videoid = op.data(this.attrName);
        this.modal.clearVariables();
        _ref = op[0].attributes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (n.constructor === Attr) {
            name_bits = /(data-)?(.*)/.exec(n.name);
            name = name_bits[2].toUpperCase();
            this.modal.setVariable(name, n.value);
          }
        }
        this.modal.openByID(videoid);
      };
      return ModalController;
    })();
  })(window.wtc.utilities);
})();