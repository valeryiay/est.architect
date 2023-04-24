'use strict';

var tools = {
    init: function(params) {

        this.client();

        if (params == undefined) return;

        var i = 0;
        var paramsLen = params.length;

        for (i; i < paramsLen; i++) {
            tools[params[i]]();
        }

    },
    client: function() {

        window.client = {
            get: function() {
                this.$document = $(document);
                this.$window = $(window);
                this.windowW = this.$window.width();
                this.windowH = this.$window.height();
                this.isMobile = this.windowW <= 1200;
                this.scrollW = this.getScrollWidth();
                this.isRetina = this.checkRetina();
            },
            getScrollWidth: function() {
                var outer = document.createElement("div");
                outer.style.visibility = "hidden";
                outer.style.width = "100px";
                outer.style.msOverflowStyle = "scrollbar";
                document.body.appendChild(outer);
                var widthNoScroll = outer.offsetWidth;
                outer.style.overflow = "scroll";
                var inner = document.createElement("div");
                inner.style.width = "100%";
                outer.appendChild(inner);
                var widthWithScroll = inner.offsetWidth;
                outer.parentNode.removeChild(outer);
                return widthNoScroll - widthWithScroll;
            },
            checkRetina: function() {
                if (window.matchMedia) {
                    var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
                    return (mq && mq.matches || (window.devicePixelRatio > 1));
                }
            },
        };

        client.get();

        client.$window.on('resize', function() {
            client.get();
        });
    },
    backgrounds: function() {

        var backgrounds = document.querySelectorAll('[data-bg-src]');
        var backgroundsLen = backgrounds.length;
        var i = 0;

        for (i; i < backgroundsLen; i++) {
            var block = backgrounds[i];

            var src = block.getAttribute("data-bg-src") || "";
            var size = block.getAttribute("data-bg-size") || "auto";
            var pos = block.getAttribute("data-bg-pos") || "auto";
            var repeat = "no-repeat";

            block.style.background = "url(" + src + ") " + pos + " / " + size + " " + repeat;
        }
    },
    tabs: function() {

        window.tabs = {
            init: function() {
                var ctrl = this;


                var elements = document.querySelectorAll("[data-tabs]");
                var classInitialized = "tabs_initialized";

                ctrl.classTabActive = "tabs__tab_active";
                ctrl.classBtnActive = "tabs__item_active";
                ctrl.tagTab = "[data-tab]";
                ctrl.tagBtn = "[data-open-tab]";

                var i = 0;
                var elementsLen = elements.length;

                for (i; i < elementsLen; i++) {
                    var block = elements[i];

                    var firstTabId = block.querySelector("[data-tab]").getAttribute("data-tab");
                    ctrl.open(block, firstTabId);
                    block.classList.add(classInitialized);
                }

                ctrl.events();
            },
            open: function(block, id) {
                var ctrl = this;


                var elements = block.querySelectorAll(ctrl.tagTab);
                var i = 0;
                var elementsLen = elements.length;

                for (i; i < elementsLen; i++) {
                    var currentTab = elements[i];
                    currentTab.classList.remove(ctrl.classTabActive);
                }

                console.log(block.querySelector("[data-tab='" + id + "']"));

                block.querySelector("[data-tab='" + id + "']").classList.add(ctrl.classTabActive);

                var btns = block.querySelectorAll(ctrl.tagBtn);
                var t = 0;
                var btnsLen = btns.length;

                for (t; t < btnsLen; t++) {
                    var currentBtn = btns[t];
                    currentBtn.classList.remove(ctrl.classBtnActive);
                }

                block.querySelector("[data-open-tab='" + id + "']").classList.add(ctrl.classBtnActive);
            },
            events: function() {
                var ctrl = this;

                client.$document.on('click', '[data-open-tab]', function() {
                    var btn = $(this);
                    var block = btn.closest('.tabs');
                    var id = btn.data('open-tab');

                    ctrl.open(block[0], id);
                });

            }
        };

        tabs.init();

    },
    modals: function() {

        window.modals = {
            init: function() {
                var ctrl = this;

                ctrl.container = document.querySelector("[data-modals]");

                ctrl.tagBtnClose = "[data-modal-close]";
                ctrl.tagBtnOpen = "[data-modal-open]";
                ctrl.classModalActive = "modal_active";

                ctrl.countOpened = 0;

                ctrl.events();

            },
            open: function(id, callback) {
                var ctrl = this;

                ctrl.hideOverflow();

                var currentModal = ctrl.container.querySelector("[data-modal='" + id + "']");
                currentModal.classList.add(ctrl.classModalActive);

                ctrl.countOpened++;

                if (callback) callback(currentModal);

            },
            close: function(id, callback) {
                var ctrl = this;

                var currentModal = ctrl.container.querySelector("[data-modal='" + id + "']");
                currentModal.classList.remove(ctrl.classModalActive);

                ctrl.countOpened--;

                if (!ctrl.countOpened) {
                    setTimeout(function() {
                        ctrl.showOverflow();
                    }, 500);
                }

                if (callback) callback(currentModal);

            },
            closeAll: function(callback) {
                var ctrl = this;

                var elements = ctrl.container.querySelectorAll("[data-modal]");
                var i = 0;
                var elementsLen = elements.length;

                for (i; i < elementsLen; i++) {
                    var el = elements[i];
                    el.classList.remove(ctrl.classModalActive);
                }

                ctrl.countOpened = 0;

                ctrl.showOverflow();

                if (callback) callback();

            },
            hideOverflow: function() {
                var ctrl = this;

                document.body.style.overflowY = "hidden";
                document.body.style.paddingRight = client.scrollW + "px";

            },
            showOverflow: function() {
                var ctrl = this;

                document.body.style.overflowY = "auto";
                document.body.style.paddingRight = "0";

            },
            events: function() {
                var ctrl = this;

                client.$document.on('click', ctrl.tagBtnClose, function(e) {
                    e.preventDefault();

                    var id = $(this).closest('.modal').data('modal');

                    ctrl.close(id);

                });

                client.$document.on('click', ctrl.tagBtnOpen, function(e) {
                    e.preventDefault();

                    var id = $(this).data('modal-open');

                    ctrl.open(id);

                });

            }
        };

        modals.init();

    },
    forms: function() {

        var validations = {
            email: function(val) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(val);
            }
        };

        window.forms = {
            init: function() {

            },
            isValid: function(type, val) {

                try {
                    return validations[type](val);
                } catch (err) {
                    //console.error('Type "' + type + '" is not defined in validation tool.');
                    return null;
                }
            }
        };



        forms.init();

    },
    preloader: function() {

        window.preloader = {
            init: function() {
                var ctrl = this;

                ctrl.urls = ctrl.getUrls();

                ctrl.loadImages(ctrl.urls);

            },
            getUrls: function() {
                var ctrl = this;

                var urls = [];

                var images = document.getElementsByTagName('img');
                var imagesLen = images.length;
                var i = 0;

                var backgrounds = document.querySelectorAll('[data-bg-src]');
                var backgroundsLen = backgrounds.length;
                var k = 0;

                for (i; i < imagesLen; i++) {
                    var url = images[i].getAttribute('src');
                    urls.push(url);
                }

                for (k; k < backgroundsLen; k++) {
                    var url = backgrounds[k].getAttribute('data-bg-src');
                    urls.push(url);
                }

                ctrl.total = imagesLen;
                ctrl.loaded = 0;

                return urls;
            },
            loadImages: function(arr) {
                var ctrl = this;

                var i = 0;
                var arrLen = arr.length;

                for (i; i < arrLen; i++) {
                    var url = arr[i];

                    var img = new Image();
                    img.src = url;

                    img.addEventListener('load', function() {
                        ctrl.loaded++;
                        ctrl.check();
                    });

                    img.addEventListener('error', function() {
                        ctrl.loaded++;
                        ctrl.check();
                    });
                }
            },
            getProgress: function() {
                var ctrl = this;

                return (ctrl.loaded / ctrl.total).toFixed(2);
            },
            check: function() {
                var ctrl = this;

                if (ctrl.loaded === ctrl.total)
                    ctrl.done();
            },
            done: function() {
                var event = new CustomEvent("preloaderDone");
                document.dispatchEvent(event);
            }
        }

        preloader.init();

    },
    templates: function() {




        // USAGE

        //document.getElementById("result").innerHTML = tmpl("tmpl-demo", data);



        /*var data = {};

        window.templates = {
        	init: function() {
        		
        		var templates = this;

        		var elements = document.querySelectorAll("[data-template]");
        		var elementsLen = elements.length;
        		var i = 0;

        		for (i; i < elementsLen; i++) {
        			var temp = elements[i];
        			var name = temp.getAttribute("data-template");
        			var tempContents = temp.innerHTML;

        			var html = document.createElement('script');
        			html.setAttribute("type", "text/x-tmpl");
        			html.innerHTML = tempContents;
        			templates.set(name, html);

        			temp.innerHTML = "";
        		}


        	},
        	get: function(name) {
        		return data[name];
        	},
        	set: function(name, html) {
        		data[name] = html;
        	}
        };

        templates.init();*/

    }
};

/*var tabs = {
	options:{},
	active:0,
	init:function()
	{	
		var $tabs = $("[data-tabs]");
		if($tabs.length>0) 
		{
			tabs.options = $("[data-tabs]").data("tabs");
			tabs.active = $("[data-tab-active]").data("tab");
			tabs.open(tabs.active, function(){ packery.init(); });

			$(document).on("click", "[data-tab]", function(){

				var _tabs = $(this).parent("[data-tabs]").data("tabs");

				if(_tabs.type!="awards")
				{
					tabs.open($(this).data("tab"), function(){ 
						packery.init(); 
						$("html, body").stop().animate({scrollTop:0}, 500, 'swing');
					});
				} 
				else 
				{
					tabs.open($(this).data("tab"), function(){});					
				}
			});
		}
	},
	open:function(a, callback)
	{
		tabs.active = a;
		$('[data-tab]').removeClass(tabs.options.active);
		$('[data-tab-content]').removeClass(tabs.options.show);

		$('[data-tab="'+a+'"]').addClass(tabs.options.active);
		$('[data-tab-content="'+a+'"]').addClass(tabs.options.show);

		callback();
	}
};*/