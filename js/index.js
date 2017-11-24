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
            console.log(index);

            $('.top-nav .nav-item li').eq(index-1).addClass('cur').siblings('li').removeClass('cur');
            /*如果当前在第四屏*/
            if (index == 4) {
                $('.concept-item-box').removeClass('active');
                $('.concept-item-box-1').addClass('active');
                PAGE.coneptChange();
            }

            if (index == 5) {
                PAGE.aboutTab();
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
        var modIndex=$(this).index()+1;
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
                curItemIndex=0;
            This.coneptTimer = setInterval(function() {
                //$('.concept-item-box').removeClass('active').addClass('fade-leave-right');
            }, 5000);
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
            $('.about-us-info-data-1').show().addClass('active');
            $('.about-us-info-data-2').hide().removeClass('active');

            $(document).on('click', '.about-us-box .next-btn', function() {
                $('.about-us-info-data-1').hide().removeClass('active');
                $('.about-us-info-data-2').show().addClass('active');
            });
            $(document).on('click', '.about-us-box .prev-btn', function() {
                $('.about-us-info-data-2').hide().removeClass('active');
                $('.about-us-info-data-1').show().addClass('active');
            });
        },
        init: function() {
            var t = this;
            t.jobPage();
        }
    }
    PAGE.init();
});