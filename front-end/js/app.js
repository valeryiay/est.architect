var app = {
    init: function() {
        tools.init(['backgrounds', 'tabs', 'modals', 'forms']);

        if ($(".home .awward").length) {
            //awardsCtrl.init();
        }



        app.plugins.init();
        app.direction.init();
        app.welcome();

        menuCtrl.init();

        if ($("#form-subscription").length) {
            subscriptionCtrl.init();
        }


        if ($(".directions").length && client.windowW > 1200) {
            directionsDecorationCtrl.init();
        }


        stickyCtrl.init();

        if ($(".about-page").length || $(".home").length) {
            aboutAwardsCtrl.init();
        }


        if ($(".project").length) {
            btnMenuCtrl.init();
        }



        if ($("[data-open-text]").length) {
            textOverflowCtrl.init();
        }





        $(".lang").on('click', function() {

            if (client.isMobile) {
                if ($(".lang").hasClass("lang_opened")) {
                    $(".lang__body").fadeOut(200);
                    $(".lang").removeClass("lang_opened");
                } else {
                    $(".lang__body").fadeIn(200);
                    $(".lang").addClass("lang_opened");
                }
            }

        });




        //langCtrl.init();





        if ($(".all-projects").length) {

            var hash = window.location.hash.slice(1);
            console.log(hash);

            $("[data-open-tab='" + hash + "']").trigger('click');

        }

        if ($(".about-page").length) {
            if (window.location.hash === "#awards") {
                var offset = $("[data-id='awards']").offset().top;
                $("html, body").animate({
                    scrollTop: offset - 100
                }, 300);
            }
        }



        $(document).on('click', '[data-scroll-to-top]', function() {
            $("html, body").animate({
                scrollTop: 0
            }, 500);
        });

        if (!client.isMobile) {
            $(window).on("scroll", function() {
                var s = $("body").scrollTop() || $("body, html").scrollTop();
                $("[data-parallax-about-image]").attr("style", "transform:translateY(-" + s / 5 + "px)");
            });
        }
    },
    welcome: function() {
        if ($("[data-preloader]").length && Cookies.get('preloader') != 1) {

            Cookies.set('preloader', '1', {
                expires: 365
            });

            $("[data-preloader]").addClass("preloader_open");

            setTimeout(function() {
                $("[data-preloader]").addClass("preloader_close-step-1");
            }, 3000);

            setTimeout(function() {


                if ($("[data-mainslide-text]").length) {
                    app.text.init();
                }

                if (client.isMobile) {
                    $("[data-animation]").removeAttr('data-animation');
                }
                $("[data-s-animation]").each(function() {
                    animation.complete($(this).data("s-animation"));
                });

                setTimeout(function() {
                    $("[data-preloader]").hide();
                }, 1200);

            }, 3500);
        } else {
            if (client.isMobile) {
                $("[data-animation]").removeAttr('data-animation');
            }

            if ($("[data-mainslide-text]").length) {
                app.text.init();
            }

            $("[data-s-animation]").each(function() {
                animation.complete($(this).data("s-animation"));
            });
        }
    },
    direction: {
        init: function() {
            $(document).on("mouseenter", "[data-item-hover]", function() {
                $item = $(this);
                var id = $item.data("item-hover");
                $('[data-item-hover]').css({
                    opacity: 0.2
                });
                $('[data-item-hover] .directions__bg').css('opacity', '0');
                $('[data-item-big="' + id + '"]').css({
                    opacity: 1
                });
                $('[data-item-hover="' + id + '"]').css({
                    opacity: 1
                });
            }).on("mouseleave", "[data-item-hover]", function() {
                $item = $(this);
                var id = $item.data("item-hover");
                $('[data-item-hover]').css({
                    opacity: 1
                });
                $('[data-item-hover] .directions__bg').css('opacity', '1');
                $('[data-item-big="' + id + '"]').css({
                    opacity: 0
                });
            });
        }
    },
    plugins: {
        init: function() {

            if (!client.isMobile) {
                animation.init();
            }


            $('[data-slick]').slick({
                fade: true,
                arrows: false,
                infinite: true,
                dots: false
            });

        }
    },
    text: {
        speed: 100,
        texts: [],
        selector: 0,
        speedDel: 75,
        speedChange: 4000,
        offsetChange: 4000,
        index: 0,
        count: 0,
        init: function() {

            app.text.selector = $("[data-mainslide-text]");
            app.text.texts = app.text.selector.data("mainslide-text").text;

            app.text.count = app.text.texts.length;
            app.text.index = 0;

            setTimeout(function() {
                app.text.send_word(app.text.texts[0]);
                app.text.setBg(0);
            }, 3000);



            setInterval(function() {

                //app.text.nextSlide();
                if (app.text.offsetChange <= 0) {
                    app.text.nextSlide();
                } else {

                }

                app.text.offsetChange -= 1000;

            }, 1000);



            app.text.events();
            /*setTimeout(function() {
            	app.text.del();
            }, 5000);*/
        },
        setBg: function(index) {
            $("[data-slider-item-index]").removeClass("slider__item_active");
            $("[data-slider-item-index='" + index + "']").addClass("slider__item_active");
        },
        send_word: function(word) {
            var text;

            for (var i = 0; i != word.length; i++) {
                text = text + "<span>" + word[i] + "</span>";
            };
            app.text.selector.html(text);

            for (var t = 0; t != word.length; t++) {
                app.text.type(t);
            };
        },
        type: function(t) {
            var t = t;
            setTimeout(function() {
                app.text.selector.find("span").eq(t).show();
            }, app.text.speed * t);
        },
        nextSlide: function() {

            app.text.offsetChange = app.text.speedChange;

            var index = app.text.index + 1 >= app.text.count ? 0 : app.text.index + 1;

            $('[data-mainslide]').removeClass("navigate__item_old_left navigate__item_old_right navigate__item_new_left navigate__item_new_right");

            if (index > app.text.index) {
                $('[data-mainslide="' + (index + 1) + '"]').addClass('navigate__item_old_left');
                $('[data-mainslide="' + (app.text.index + 1) + '"]').addClass('navigate__item_new_right');
            } else {
                $('[data-mainslide="' + (index + 1) + '"]').addClass('navigate__item_old_right');
                $('[data-mainslide="' + (app.text.index + 1) + '"]').addClass('navigate__item_new_left');
            }



            $('[data-mainslide]').removeClass('navigate__item_active');
            $('[data-mainslide="' + (index + 1) + '"]').addClass('navigate__item_active');


            app.text.setBg(index);
            app.text.del();
            setTimeout(function() {
                app.text.send_word(app.text.texts[index]);
                app.text.index = index;
            }, 800);


        },
        del: function() {

            var len = app.text.selector.find("span").length;

            app.text.speedDel = 500 / len;

            for (var i = 0; i < len; i++) {
                app.text.delLetter(i + 1, len);
            }




        },
        delLetter: function(i, len) {

            setTimeout(function() {
                app.text.selector.find("span").eq(len - i).hide();
                //console.log(len-i);
            }, app.text.speedDel * i);

        },
        events: function() {
            $(document).on('click', '[data-mainslide]', function() {
                var index = $(this).data('mainslide');


                $('[data-mainslide]').removeClass("navigate__item_old_left navigate__item_old_right navigate__item_new_left navigate__item_new_right");

                if (index > app.text.index) {
                    $('[data-mainslide="' + (index) + '"]').addClass('navigate__item_old_left');
                    $('[data-mainslide="' + (app.text.index + 1) + '"]').addClass('navigate__item_new_right');
                } else {
                    $('[data-mainslide="' + (index) + '"]').addClass('navigate__item_old_right');
                    $('[data-mainslide="' + (app.text.index + 1) + '"]').addClass('navigate__item_new_left');
                }

                $(this).siblings('.navigate__item').removeClass('navigate__item_active');
                $(this).addClass('navigate__item_active');
                app.text.offsetChange = app.text.speedChange;
                app.text.del();
                app.text.setBg(index - 1);
                app.text.index = index - 1;
                setTimeout(function() {
                    app.text.send_word(app.text.texts[index - 1]);
                }, 800);
            });
        },
        erase: function() {

        }
    }
};

var animation = {
    options: {
        offset: 0
    },
    init: function() {
        var s = client.$window.scrollTop();
        animation.options.offset = client.windowH * 1.1;
        animation.check(s);
        animation.events();
    },
    check: function(s) {
        $("[data-animation]").each(function() {
            var $el = $(this);
            var offset = $el.offset().top;
            if (offset <= s + animation.options.offset) {
                $(this).attr("data-animation-complete", "");
            }
        });
    },
    events: function() {
        client.$window.on('scroll', function() {
            var s = client.$window.scrollTop();
            animation.check(s);
        });
    },
    complete: function(name) {
        $('[data-s-animation="' + name + '"]').attr("data-animation-complete", "");
    }
};











var menuCtrl = {
    init: function() {

        this.html = {
            $panel: $("[data-panel-menu]"),
            $btnClose: $("[data-panel-menu-close]"),
            $btnOpen: $("[data-panel-menu-open]")
        };

        this.classes = {
            panelActive: "panel-menu_active"
        };

        this.events();

    },
    hideOverflow: function() {

        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = client.scrollW + "px";

    },
    showOverflow: function() {

        document.body.style.overflowY = "auto";
        document.body.style.paddingRight = "0";

    },
    open: function() {

        this.html.$panel.addClass(menuCtrl.classes.panelActive);

        if (client.isMobile) {
            menuCtrl.hideOverflow();
        }

    },
    close: function() {

        this.html.$panel.removeClass(menuCtrl.classes.panelActive);

        if (client.isMobile) {
            menuCtrl.hideOverflow();
        }

    },
    events: function() {

        this.html.$btnOpen.on('click', function() {
            menuCtrl.open();
        });

        this.html.$btnClose.on('click', function() {
            menuCtrl.close();
        });

    }
};




var langCtrl = {
    init: function() {

        this.html = {
            $lang: $(".lang"),
            $link: $(".lang__link"),
            $body: $(".lang__body")
        };


        this.events();

    },
    open: function() {

        this.html.$body.slideDown(300);

    },
    close: function() {

        this.html.$body.slideUp(300);

    },
    events: function() {

        client.$document.on('mouseenter', '.lang', function() {
            langCtrl.open();
        });

        client.$document.on('mouseout', '.lang', function() {
            langCtrl.close();
        });

    }
};



var ajax = function(url, method, data, success, error) {
    $.ajax({
        url: url,
        data: data,
        processData: false,
        contentType: false,
        type: method.toUpperCase(),
        success: function(data) {
            success(data);
        },
        error: function(data) {
            error(data);
        }
    });
};




var subscriptionCtrl = {
    init: function() {

        var _this = this;

        _this.html = {
            form: document.getElementById("form-subscription")
        };

        _this.data = {
            method: _this.html.form.getAttribute('method').toLowerCase(),
            url: _this.html.form.getAttribute('action'),
            formData: null
        };

        _this.events();

    },
    onSubmit: function() {

        var _this = this;

        var form = _this.html.form;

        var data = new FormData(form);

        var isValid = _this.isDataValid(data);

        if (isValid) {
            _this.data.formData = data;
            _this.send();
        }

    },
    send: function() {

        var _this = subscriptionCtrl;

        var url = _this.data.url;
        var method = _this.data.method;
        var data = _this.data.formData;

        ajax(url, method, data, _this.onSuccess, _this.onError);

    },
    onSuccess: function() {

        var _this = this;

        subscriptionCtrl.html.form.reset();

        subscriptionCtrl.html.form.getElementsByTagName("input")[0].style.display = "none";
        subscriptionCtrl.html.form.getElementsByTagName("button")[0].style.display = "none";
        subscriptionCtrl.html.form.querySelector(".success").style.display = "block";

    },
    onError: function() {

        var _this = this;

        alert("О найн! Ошибка!");

    },
    isDataValid: function(data) {

        var _this = subscriptionCtrl;

        var isValid = 1;

        var names = ['email'];

        var validate = {
            email: function(val) {
                return forms.isValid('email', val);
            }
        };

        var i = 0,
            len = names.length;
        for (i; i < len; i++) {
            var name = names[i];
            var value = data.get(name);

            var _query = "input[name='" + name + "']";
            var field = _this.html.form.querySelector(_query);
            if (field !== null) {
                field = field;
            } else {
                continue;
            }
            if (validate.hasOwnProperty(name) && !validate[name](value)) {
                isValid = 0;
                field.classList.add('input_has_error');
            } else {
                field.classList.remove('input_has_error');
            }
        }

        return isValid;
    },
    events: function() {

        var _this = this;

        var form = _this.html.form;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            _this.onSubmit();
        });

    }
};


var directionsDecorationCtrl = {
    init: function() {

        this.html = {
            $element: $(".directions__decoration")
        };

        this.data = {
            blockTop: $(".directions").offset().top,
            blockHeight: $(".directions").height()
        };

        this.events();

    },
    move: function(s) {

        var $element = this.html.$element;

        var y = ((s - this.data.blockTop + this.data.blockHeight - 112 - client.windowH / 2) * 0.7).toFixed(0);

        $element.css({
            '-webkit-transform': 'translate3d(0, ' + y + 'px, 1px)',
            'transform': 'translate3d(0, ' + y + 'px, 1px)'
        }, 0);

    },
    checkPos: function() {

        var s = client.$window.scrollTop();

        if (s >= this.data.blockTop - client.windowH && s < this.data.blockTop + this.data.blockHeight) {
            this.move(s);
        }

    },
    events: function() {

        client.$window.on('scroll', function() {
            directionsDecorationCtrl.checkPos();
        });

        client.$window.on('resize', function() {

            if (client.$window.width() <= 1200) {
                directionsDecorationCtrl.checkPos = function() {
                    return false;
                }

                return;
            }

            setTimeout(function() {
                this.data = {
                    blockTop: $(".directions").offset().top,
                    blockHeight: $(".directions").height()
                };

                directionsDecorationCtrl.checkPos();
            }, 200);
        });

    }
};



var awardsCtrl = {
    init: function() {

        var $aw = $(".awward");
        var $seg = $(".segment");
        var len = $aw.length;

        var bottomLabel = (1425 - (27 * len)) / len - 46;
        var bottomDiv = (1425 - (27 * len)) / len - 52;

        $aw.css({
            'margin-bottom': bottomLabel
        });

        $seg.css({
            'margin-right': bottomDiv
        });


        this.events();

    },
    events: function() {

        client.$window.on('resize', function() {

            var $aw = $(".awward");
            var $seg = $(".segment");
            var len = $aw.length;

            var bottomLabel = (1425 - (27 * len)) / len - 46;
            var bottomDiv = (1425 - (27 * len)) / len - 52;

            $aw.css({
                'margin-bottom': bottomLabel
            });

            $seg.css({
                'margin-right': bottomDiv
            });

        });

    }
};

var stickyCtrl = {
    init: function() {


        stickyCtrl.html = {
            $sidebars: $("[data-sticky-sidebar]")
        };


        stickyCtrl.html.$sidebars.each(function() {

            var $sidebar = $(this);

            var options = $sidebar.data('sticky-sidebar');

            $sidebar.stick_in_parent(options);

        });

        stickyCtrl.events();
    },
    events: function() {

        client.$window.on('resize', function() {
            stickyCtrl.html.$sidebars.trigger("sticky_kit:recalc");
        });

    }
};


var aboutAwardsCtrl = {
    setDefault: function() {
        $('[data-line]').removeClass("awward_hide");
        $(".awards__timeline").animate({
            scrollLeft: 3000
        }, 750);
    },
    init: function() {
        aboutAwardsCtrl.setDefault();

        $('.timeline__segments').css("padding-top", 199); //-(window.innerWidth-document.documentElement.clientWidth));
        $('.timeline__line').css("top", 208); //-(window.innerWidth-document.documentElement.clientWidth));


        var hold = 0

        $(document).on("click", "[data-click-year]", function() {
            var y = $(this).data("click-year");

            $("[data-click-year]").removeClass("tabs__item_active");
            $(this).addClass("tabs__item_active");

            if (y == "all") {
                aboutAwardsCtrl.setDefault();
            } else {
                var left = $('[data-year="' + y + '"]').position().left + 240;
                /*$(".timeline__content").css("left", left+50);
                $(".timeline__move").css("left", left);*/

                $('[data-line]').addClass("awward_hide");
                $('[data-line="' + y + '"]').removeClass("awward_hide");

                if (y == 2010) {
                    left = 186;
                }

                $(".awards__timeline").animate({
                    scrollLeft: (left - 186)
                }, 750);
                hold = 1;
                setTimeout(function() {
                    hold = 0;
                }, 850);

            }
        });

        $(".awards__timeline").on("scroll", function() {
            if (hold == 0) {
                $('[data-line]').removeClass("awward_hide");
                $("[data-click-year]").removeClass("tabs__item_active");
                $('[data-click-year="all"]').addClass("tabs__item_active");
            }
        });
    }
};


var btnMenuCtrl = {
    init: function() {

        btnMenuCtrl.classes = {
            btn: "header__menu",
            btnWhite: "header__menu_white",
            poster: "project__hero"
        };

        btnMenuCtrl.html = {
            $btn: $('.' + btnMenuCtrl.classes.btn),
            $poster: $('.' + btnMenuCtrl.classes.poster)
        };

        btnMenuCtrl.data = {
            isWhite: btnMenuCtrl.html.$btn.hasClass(btnMenuCtrl.classes.btnWhite),
            posterH: btnMenuCtrl.html.$poster.outerHeight()
        };


        var s = client.$window.scrollTop();

        var offset = 65;

        if (s >= btnMenuCtrl.data.posterH - offset) {
            //btnMenuCtrl.switchColor();
            return;
        }




        btnMenuCtrl.events();

    },
    switchColor: function() {

        /*if (btnMenuCtrl.data.isWhite) {
        	btnMenuCtrl.html.$btn.removeClass(btnMenuCtrl.classes.btnWhite);
        	btnMenuCtrl.data.isWhite = false;
        } else {
        	btnMenuCtrl.html.$btn.addClass(btnMenuCtrl.classes.btnWhite);
        	btnMenuCtrl.data.isWhite = true;
        }*/

    },
    checkPosition: function() {


        var s = client.$window.scrollTop();

        var offset = 65;

        if (s >= btnMenuCtrl.data.posterH - offset && btnMenuCtrl.data.isWhite) {
            btnMenuCtrl.switchColor();
            return;
        }

        if (s < btnMenuCtrl.data.posterH - offset && !btnMenuCtrl.data.isWhite) {
            btnMenuCtrl.switchColor();
            return;
        }

    },
    events: function() {

        client.$window.on('scroll', function() {
            btnMenuCtrl.checkPosition();
        });

    }
};


var textOverflowCtrl = {
    init: function() {


        textOverflowCtrl.events();

        $("[data-open-text]").each(function() {

            var $btn = $(this);
            var $block = $btn.prev();

            if ($block.outerHeight() < 100) {
                $btn.hide();
            }

        });



    },
    events: function() {

        client.$document.on('click', '[data-open-text]', function() {

            var $btn = $(this);


            //var $card = $btn.closest('.card');
            var $text = $btn.prev();

            if ($btn.hasClass('open_active')) {

                var h = $text.data('text-start-height');
                console.log(h);

                $text.animate({
                    height: h
                }, function() {
                    $text.css({
                        "max-height": h
                    })
                });

                $btn.removeClass('open_active');

            } else {

                var h = $text.outerHeight();
                $text.data('text-start-height', h);


                $text.css({
                    "max-height": "none",
                    "height": "auto"
                });

                var newH = $text.outerHeight();

                console.log(newH);

                $text.css({
                    "height": h
                });


                $text.animate({
                    height: newH
                });

                $btn.addClass('open_active');
            }


        });

        client.$window.on('resize', function() {

            $("[data-open-text]").each(function() {

                var $btn = $(this);


                var $text = $btn.prev();

                $text.attr("style", "");

                $btn.removeClass('open_active');


            });

        });

    }
};

































$(document).ready(function() {
    app.init();
});