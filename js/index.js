$(function() {
    var secLen = $('#page-wrap .section').length;
    $('#page-wrap').fullpage({
        scrollingSpeed: 600,
        verticalCentered: true,
        easing: 'easeInOutCubic',
        easingcss3: 'ease-in',
        // navigation: !0,
        resize: false,
        fitToSection: true,
        // navigationPosition: 'right',
        lazyLoading: true,
        scrollOverflow: true,
        scrollOverflowReset: false,
        scrollOverflowOptions: {
            'scrollbars': false,
            'mouseWheel': true,
            'hideScrollbars': true,
            'fadeScrollbars': true,
            'disableMouse': true
        },
        afterLoad: function(anchorLink, index) {
            $('.top-nav .nav-item li').eq(index - 1).addClass('cur').siblings('li').removeClass('cur');
            /*如果当前在第四屏*/
            if (index == 4) {
                $('.concept-item-box').removeClass('active');
                $('.concept-item-box-1').addClass('active');
                PAGE.coneptChange();
            } else {
                clearTimeout(PAGE.coneptTimer);
                $('.concept-item-box').removeClass('active');
                $('.concept-item-box-1').show();
            }

            if (index == 5) {
                $('.about-us-info-data-1').show().addClass('active');
                $('.about-us-info-data-2').hide().removeClass('active');
            } else {
                $('.about-us-info-data-1,.about-us-info-data-2').hide().removeClass('active');
            }

            /*给浅色背景图区域加深导航条背景色*/
            if (index == 2 || index == 3 || index == 6 || index == 7) {
                $('.top-nav').addClass('black-nav');
            } else {
                $('.top-nav').removeClass('black-nav')
            }
        },
        onLeave: function(index, nextIndex, direction) {
            //console.log(index + '    ' + nextIndex + '    ' + direction);

            if (nextIndex > 1) {
                $('.top-nav').addClass('scale-nav');
            } else {
                $('.top-nav').removeClass('scale-nav');
            }

            /*如果当前在第四屏*/
            if (index == 4) {
                $('.concept-item-box').removeClass('active');
                clearInterval(PAGE.coneptTimer);
            }

            if (index == secLen && direction == 'up') {
                $.fn.fullpage.moveTo(secLen - 2);
            }
        }
    });

    // if($(window).width<1200||$(window).height()<760){
    //     $.fn.fullpage.destroy('all');
    //     $('#page-wrap .section').css("height",1000);
    // }
    // $(window).resize(function(){
    //     if($(window).width<1200||$(window).height()<760){
    //         $.fn.fullpage.destroy('all');
    //         $('#page-wrap .section').css("height",1000);
    //     }    
    // });

    $('.page-arrow').on('click', function() {
        $.fn.fullpage.moveTo(2);
    });

    $('.nav-item li').on('click', function() {
        var modIndex = $(this).index() + 1;
        $(this).addClass('cur').siblings('li').removeClass('cur');
        $.fn.fullpage.moveTo(modIndex);
    });

    var mainScreenSwiper = new Swiper('.main-screen-box', {
        pagination: '.main-screen-page',
        loop: true,
        effect: "fade",
        autoplay: 3000,
        speed: 600,
        grabCursor: true,
        paginationClickable: true
    });

    // $('.arrow-left').on('click', function(e) {
    //     e.preventDefault()
    //     mySwiper.swipePrev()
    // })
    // $('.arrow-right').on('click', function(e) {
    //     e.preventDefault()
    //     mySwiper.swipeNext()
    // })

    var figSlide = function(param) {
        this.autoStart = false || param.autoStart;
        this.loop = false || param.loop;
        this.sNode = param.sNode;
        this.sInnerBox = param.sInnerBox;
        this.sPage = '' || param.sPage;
        this.sPrev = '' || param.sPrev;
        this.sNext = '' || param.sNext;
        this.sDuring = !!param.sDuring ? param.sDuring : 3000;
        this.sPreview = param.sPreview;
        this.slideCallBack = param.slideCallBack;
        this.initCallBack = '' || param.initCallBack;
    };

    figSlide.prototype = {
        sTimer: null,
        sIndex: 0,
        sWidth: 0,
        sLen: 0,
        sPageNode: '',
        sPageIndex: 0,
        // 图片效果
        slideImg: function() {
            var self = this;
            if (self.loop) {
                if (self.sIndex >= self.sLen - self.sPreview) {
                    $(self.sNode).stop().animate({
                        left: -self.sWidth * (self.sLen - self.sPreview)
                    }, 300, function() {
                        self.sIndex = (self.sLen - 1) / 2 - self.sPreview + 1;
                        $(self.sNode).stop().css({
                            left: -self.sWidth * self.sIndex
                        });
                    });
                    self.sPageIndex = 0;
                } else if (self.sIndex <= 0) {
                    $(self.sNode).stop().animate({
                        left: 0
                    }, 300, function() {
                        self.sIndex = (self.sLen - 1) / 2;
                        $(self.sNode).stop().css({
                            left: -self.sWidth * self.sIndex
                        });
                    });
                    self.sPageIndex = 0;
                } else {
                    $(self.sNode).stop().animate({
                        left: -self.sWidth * self.sIndex
                    }, 300);

                    if (self.sIndex > (self.sLen - 1) / 2 - 1) {
                        self.sPageIndex = self.sIndex - (self.sLen - 1) / 2;
                    } else {
                        self.sPageIndex = self.sIndex;
                    }
                }
            } else {
                if (self.sIndex >= self.sLen) {
                    $(self.sNode).stop().animate({
                        left: 0
                    }, 300);
                    self.sPageIndex = self.sIndex = 0;
                } else if (self.sIndex < 0) {
                    $(self.sNode).stop().animate({
                        left: -self.sWidth * (self.sLen - 1)
                    }, 300);
                    self.sPageIndex = self.sIndex = self.sLen - 1;
                } else {
                    $(self.sNode).stop().animate({
                        left: -self.sWidth * self.sIndex
                    }, 300);
                    self.sPageIndex = self.sIndex;
                }
            }

            if ($(self.sPageNode).length > 0) {
                $(self.sPageNode).removeClass('active').eq(self.sPageIndex).addClass('active');
            }

            // 执行回调
            self.slideCallBack && self.slideCallBack(self.sPageIndex);
        },
        // 自动播放
        autoPlay: function() {
            var self = this;
            self.sTimer = setInterval(function() {
                self.sIndex++;
                self.slideImg(self.sIndex);
            }, self.sDuring);
        },
        // 初始化
        init: function() {
            var self = this;
            var wEle = $(self.sNode).html(),
                wLen = $(self.sNode).children(self.sInnerBox).length,
                indexEle = $(self.sNode).children(self.sInnerBox).eq(0);

            self.sWidth = indexEle.outerWidth(true);

            // 如果循环播放
            if (self.loop) {
                var indexNode = indexEle[0].outerHTML;
                $(self.sNode).append(wEle + indexNode);
                self.sLen = $(self.sNode).children(self.sInnerBox).length;
                $(self.sNode).css({
                    width: self.sLen * self.sWidth,
                    left: -wLen * self.sWidth
                });
                self.sIndex = (self.sLen - 1) / 2;
            } else {
                self.sLen = $(self.sNode).children(self.sInnerBox).length;
                $(self.sNode).css({
                    width: self.sLen * self.sWidth
                });

            }

            clearInterval(self.sTimer);
            // 如果开启自动播放
            if (self.autoStart) {
                self.autoPlay();
                $(self.sNode + ',' + self.sPrev + ',' + self.sNext).on('mouseenter', function() {
                    clearInterval(self.sTimer);
                }).on('mouseleave', function() {
                    self.autoPlay();
                });
            }

            // 如果存在分页
            if ($(self.sPage).length > 0) {
                // 添加分页显示
                var pageELe = '<span class="active"></span>';

                self.sPageNode = self.sPage + ' span';

                for (var i = 0; i < wLen - 1; i++) {
                    pageELe += '<span></span>';
                }
                $(self.sPage).html(pageELe);

                // 如果自动播放，则鼠标滑过分页页码暂停播放
                if (self.autoStart) {
                    $(self.sPageNode).on('mouseenter', function() {
                        if (self.sIndex > (self.sLen - 1) / 2 - 1) {
                            self.sIndex = $(this).index() + (self.sLen - 1) / 2;
                        }
                        clearInterval(self.sTimer);
                        self.slideImg(self.sIndex);
                    }).on('mouseleave', function() {
                        self.autoPlay();
                    });
                } else {
                    $(self.sPageNode).on('mouseenter', function() {
                        if (self.sIndex > (self.sLen - 1) / 2 - 1) {
                            self.sIndex = $(this).index() + (self.sLen - 1) / 2;
                        }
                        self.slideImg(self.sIndex);
                    });
                }
            }

            // 上一页
            !!self.sPrev && $(self.sPrev).on('click', function() {
                self.sIndex--;
                self.slideImg(self.sIndex);
            });

            // 下一页
            !!self.sNext && $(self.sNext).on('click', function() {
                self.sIndex++;
                self.slideImg(self.sIndex);
            });

            self.initCallBack && self.initCallBack();
        },
        // 开始
        start: function() {
            var self = this;
            clearInterval(self.sTimer);
            self.autoPlay();
        },
        // 暂停
        pause: function() {
            var self = this;
            clearInterval(self.sTimer);
        }
    };

    figSlide.create = function(options) {
        var FS = new figSlide(options);
        FS.init();
        return FS;
    };

    // 产品列表
    var hotFigSlide = figSlide.create({
        autoStart: true,
        loop: true,
        sNode: '#product-list ul',
        sInnerBox: 'li',
        sPreview: 3,
        sDuring: 4000,
        sPrev: '.product-cont .prev-btn',
        sNext: '.product-cont .next-btn',
        slideCallBack: function() {}
    });

    /*页面方法*/
    var PAGE = {
        coneptTimer: null,
        coneptChange: function() {
            var This = this,
                curItemIndex = 0,
                changeTimer = null,
                maxItemLen = $('.concept-item-box').length - 1;

            setTimeout(function() {
                $('.concept-cont .concept-item-box').eq(0).addClass('fade-leave-right').removeClass('active');
                setTimeout(function() {
                    $('.concept-cont .concept-item-box').eq(0).hide().removeClass('active fade-leave-right');
                    $('.concept-cont .concept-item-box').eq(1).show().addClass('active').removeClass('fade-leave-right');
                }, 1600);
            }, 4000);

            This.coneptTimer = setInterval(function() {
                curItemIndex++, curItemIndex > maxItemLen && (curItemIndex = 0);
                clearTimeout(changeTimer);
                if (curItemIndex == 1) {
                    $('.concept-cont .concept-item-box').eq(0).addClass('fade-leave-right').removeClass('active');
                    changeTimer = setTimeout(function() {
                        $('.concept-cont .concept-item-box').eq(0).hide().removeClass('active fade-leave-right');
                        $('.concept-cont .concept-item-box').eq(1).show().addClass('active').removeClass('fade-leave-right');
                    }, 1600);
                } else {
                    $('.concept-cont .concept-item-box').eq(1).addClass('fade-leave-right').removeClass('active');
                    changeTimer = setTimeout(function() {
                        $('.concept-cont .concept-item-box').eq(1).hide().removeClass('active fade-leave-right');
                        $('.concept-cont .concept-item-box').eq(0).show().addClass('active').removeClass('fade-leave-right');
                    }, 1600);
                }
            }, 9000);

        },
        // 招聘信息分页
        jobPage: function() {
            var onePageNum = 4,
                maxPage = Math.ceil($('.job-list-box li').length / onePageNum),
                curPage = 1;

            function showPage(num) {
                var i = onePageNum * (num - 1),
                    mx = onePageNum * num;
                $('.job-list-box li').hide().slice(i, mx).fadeIn(300);
            }

            $(document).on('click', '.job-list-page .prev-btn', function() {
                curPage--;
                if (curPage <= 1) {
                    $('.job-list-page .prev-btn').addClass('disable');
                    if (curPage == 1) {
                        showPage(curPage);
                    } else {
                        curPage = 1;
                    }
                    return false;
                } else {
                    if (curPage < maxPage) {
                        $('.job-list-page .next-btn').removeClass('disable');
                    }
                    $('.job-list-page .prev-btn').removeClass('disable');
                }
                showPage(curPage);
            });

            $(document).on('click', '.job-list-page .next-btn', function() {
                curPage++;

                if (curPage >= maxPage) {
                    $('.job-list-page .next-btn').addClass('disable');
                    if (curPage == maxPage) {
                        showPage(curPage);
                    } else {
                        curPage = maxPage;
                    }
                    return false;
                } else {
                    if (curPage > 1) {
                        $('.job-list-page .prev-btn').removeClass('disable');
                    }
                    $('.job-list-page .next-btn').removeClass('disable');
                }
                showPage(curPage);
            });

            /*职业详情显示*/
            $(document).on('click', '.job-list-box li', function() {
                var curIndex = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $('.job-detail .job-detail-item').hide().eq(curIndex).fadeIn(300);
            });
        },
        /*关于我们*/
        aboutTab: function() {
            $(document).on('click', '.about-us-box .next-btn', function() {
                $('.about-us-info-data-1').hide().removeClass('active');
                $('.about-us-info-data-2').show().addClass('active');
            });
            $(document).on('click', '.about-us-box .prev-btn', function() {
                $('.about-us-info-data-2').hide().removeClass('active');
                $('.about-us-info-data-1').show().addClass('active');
            });
        },
        getPureT: function(str) {
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            return str;
        },
        // 提交验证
        submitCheck: function() {
            var self = this;

            $('#user-name').on('blur', function() {
                var userName = $('#user-name').val();
                if (userName == '') {
                    $('.name-item .fill-tips').html("请输入您的姓名");
                } else {
                    if (userName.length < 2) {
                        $('.name-item .fill-tips').html("最少输入2个字");
                    } else {
                        $('.name-item .fill-tips').html("");
                    }
                }
            });

            $('#user-phone').on('blur', function() {
                var phoneNum = $('#user-phone').val();
                if (phoneNum == '') {
                    $('.phone-item .fill-tips').html("请输入您的手机号码");
                } else {
                    if (!(/^1[3|4|5|7|8][0-9]{9}$/).test(phoneNum)) {
                        $('.phone-item .fill-tips').html("请输入正确的手机号码");
                    } else {
                        $('.phone-item .fill-tips').html("");
                    }
                }
            });

            $('#user-email').on('blur', function() {
                var emailVal = $('#user-email').val();
                if (emailVal == '') {
                    $('.email-item .fill-tips').html("");
                } else {
                    if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/).test(emailVal)) {
                        $('.email-item .fill-tips').html("请输入正确的邮箱地址！");
                    } else {
                        $('.email-item .fill-tips').html("");
                    }
                }
            });

            $('#user-words').on('blur', function() {
                var wordCont = $('#user-words').val();
                if (wordCont == '') {
                    $('.words-item .fill-tips').html("请写下您的留言");
                } else {
                    if (wordCont.length < 8) {
                        $('.words-item .fill-tips').html('最少输入8个字');
                    } else {
                        $('.words-item .fill-tips').html("");
                    }
                }
            });

            $('#submit-btn').click(function() {
                var userName = $('#user-name').val(),
                    phoneNum = $('#user-phone').val(),
                    emailVal = $('#user-email').val(),
                    wordCont = self.getPureT($('#user-words').val());

                if (userName == '') {
                    $('.name-item .fill-tips').html("请输入您的姓名");
                    return false;
                } else {
                    if (userName.length < 2) {
                        $('.name-item .fill-tips').html("最少输入2个字");
                        return false;
                    } else {
                        $('.name-item .fill-tips').html("");
                    }
                }

                if (phoneNum == '') {
                    $('.phone-item .fill-tips').html("请输入您的手机号码");
                    return false;
                } else {
                    if (!(/^1[3|4|5|7|8][0-9]{9}$/).test(phoneNum)) {
                        $('.phone-item .fill-tips').html("请输入正确的手机号码");
                        return false;
                    }
                }

                if (emailVal !== '') {
                    if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/).test(emailVal)) {
                        $('.email-item .fill-tips').html("请输入正确的邮箱地址");
                        return false;
                    }
                }

                if (wordCont == '') {
                    $('.words-item .fill-tips').html("请写下您的留言");
                    return false;
                } else {
                    if (wordCont.length < 8) {
                        $('.words-item .fill-tips').html("最少输入8个字");
                        return false;
                    }
                }
                // 此处提交表单操作
                $.ajax({
                    url: '//xietest.money.xiaoshushidai.com/ajax-save_contact_info',
                    data: {
                        "name": userName,
                        "phone": phoneNum,
                        "email": emailVal,
                        "message": wordCont
                    },
                    type: "GET",
                    dataType: "json",
                    // jsonp: "jsonCallback",
                    success: function(res) {
                        console.log(res);
                        if (res.status == 1) {
                            self.submitTip("提交成功，感谢您的参与！", !0);
                            $('#user-name,#user-phone,#user-email,#user-words').val('');
                        } else {
                            self.submitTip(res.msg, !1);
                        }
                    },
                    error: function() {
                        self.submitTip('提交失败，请稍后再试', !1);
                    }
                });
            });
        },
        tipTimer: null,
        submitTip: function(tipTxt, subStatus) {
            var self = this;
            clearTimeout(self.tipTimer);
            $('.submit-tip').html(tipTxt);
            if (subStatus) {
                $('.submit-tip').css('color', '#5BDFB8');
            } else {
                $('.submit-tip').css('color', '#f00');
            }
            self.tipTimer = setTimeout(function() {
                $('.submit-tip').html("");
            }, 4000);
        },
        init: function() {
            var t = this;
            t.jobPage();
            t.aboutTab();
            t.submitCheck();
        }
    }
    PAGE.init();
});