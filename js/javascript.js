// 메인 visual 슬라이드
$(function(){
    const $main = $('section.main');
    const $visual = $('section>.visual');
    const $slide = $('section>.visual>.slide>li');
    const $indicator = $('section>.visual>.pagination>ol>li');

    let winHeight = 0; // 브라우저 창 높이 (0으로 초기화, 이후 브라우저 창 크기에 따라 결정)
    let visualIdx = 0; // visual 슬라이드 index
    let oldIdx = null;
    let intervalKey = null; // 자동재생을 위한

    // visual 크기 브라우저 창 크기에 맞춤
    const visualSize = function(){
        winHeight = $(window).height();
        $main.css({'height':winHeight});
        $visual.css({'height':winHeight});
    };

    const slidePlay = function(){
        // 클릭한 순서에 해당되는 슬라이드 활성화
        $slide.eq(visualIdx).stop().fadeIn(400,function(){
            $slide.eq(visualIdx).addClass('on').siblings().removeClass('on');
            $slide.eq(oldIdx).stop().fadeOut(400);
        });

        // 인디케이터 활성화
        $indicator.eq(visualIdx).addClass('on').siblings().removeClass('on');
    };

    const autoSlide = function(){
        intervalKey = setInterval(function(){
            oldIdx = visualIdx;
            if(visualIdx>=2){
                visualIdx = 0;
            }else{
                visualIdx++;
            }
            
            slidePlay();
        },5000);
    };

    $(window).on({
        'load resize':function(){
            visualSize();
        }
        ,
        'load':function(){
            $('html,body').stop().animate({'scrollTop':0});

            visualIdx = 0;
            
            $slide.eq(visualIdx).stop().fadeIn(400,function(){
                $slide.eq(visualIdx).addClass('on').siblings().removeClass('on');
            });

            autoSlide();
        }
    });

    $indicator.on('click',function(){
        oldIdx = visualIdx;
        visualIdx = $indicator.index(this);

        if(oldIdx!=visualIdx){
            slidePlay();
        }

        clearInterval(intervalKey);

        autoSlide();
    });

});

// 스크롤 위치 관련 이벤트
$(function(){
    // 스크롤 이벤트
    const $tit = $('header>.tit');
    const $logo = $('header>.tit .logo');
    const $gnb = $('header>nav>.gnb>li');
    const $top = $('header>nav>.top');
    const $uiux = $('section>#uiux');
    const $webpofol = $('section>#webpofol');
    const $myProject = $('section>#my-project');
    const $article = $('section.conts>article');
    const $ftLogo = $('footer .ftlogo');
    
    // aboutme 시작위치 : visual 섹션 바로 아래
    let aboutmeTop = $(window).height();
    let uiuxTop = $uiux.offset().top - parseInt($article.css('margin-top'));
    let webpofolTop = $webpofol.offset().top - parseInt($article.css('margin-top'));
    let myProjectTop = $myProject.offset().top - parseInt($article.css('margin-top'));

    let gnbTop = [aboutmeTop,uiuxTop,webpofolTop,myProjectTop];
    
    // visualIn이란? 현재 브라우저 윈도우 위치가 visual 섹션 안에 있는지 여부
    let visualIn = true;

    const back2Top = function(){
        $('html,body').stop().animate({'scrollTop':0});
    };

    // 화면 크기 조정될 시 aboutmeTop 위치 자동 변경
    $(window).on('load resize',function(){
        aboutmeTop = $(window).height();
        uiuxTop = $uiux.offset().top - parseInt($article.css('margin-top'));
        webpofolTop = $webpofol.offset().top - parseInt($article.css('margin-top'));
        myProjectTop = $myProject.offset().top - parseInt($article.css('margin-top'));

        gnbTop = [aboutmeTop,uiuxTop,webpofolTop,myProjectTop];
    });
    
    // 로고, Top 버튼 클릭 시 페이지 상단 이동
    $logo.on('click',function(evt){
        evt.preventDefault();
        
        back2Top();
    });
    
    $top.on('click',function(evt){
        evt.preventDefault();

        back2Top();
    });
    
    $ftLogo.on('click',function(evt){
        evt.preventDefault();

        back2Top();
    });

    // gnb 항목 클릭 시 해당 항목 위치로 이동
    $gnb.on('click',function(evt){
        evt.preventDefault();
        
        let gnbIdx = $gnb.index(this);
        
        $('html,body').stop().animate({'scrollTop':gnbTop[gnbIdx]+1});
        
        $gnb.eq(gnbIdx).addClass('on').siblings().removeClass('on');
    });

    // 사이트 scroll 양에 따른 이벤트
    $(document).on('scroll',function(){
        let scrollTop = $(window).scrollTop();

        // visual 영역이 화면 상단으로 올라가면 Title바 출현
        if(scrollTop>=aboutmeTop){
            if(visualIn){
                visualIn = false;
                $tit.stop().slideDown(200);
            }
        }else{
            if(!visualIn){
                visualIn = true;
                $tit.stop().slideUp(200);
            }
        }
    
        // scrollTop 양에 따른 GNB 항목 활성화
        if(scrollTop<gnbTop[0]){
            $gnb.removeClass('on');
        }

        for(let i=0;i<3;i++){
            if(scrollTop>=gnbTop[i] && scrollTop<gnbTop[i+1]){
                $gnb.eq(i).addClass('on').siblings().removeClass('on');
            }
        }

        if(scrollTop>=gnbTop[3]){
            $gnb.eq(3).addClass('on').siblings().removeClass('on');
        }
    });

    // console.log($('footer .ftcont').width());
    // console.log($('footer .contact').height());
    // console.log($('#aboutme').height());
});

// 각 항목 제목의 width를 동적 계산하여 margin-left: -width/2 설정하여 가운데 정렬
$(function(){
    const $topic = $("section.conts>article>.topic");
    let length = $topic.length;

    for(let i=0;i<length;i++){
        $topic.eq(i).css({'margin-left':-$topic.eq(i).width()/2});
    }
});

// 프로필 -> li hover 시 해당 태그 내 div(텍스트) 나타남
$(function(){
    const $list = $(".list>li");
    const $keyword = $(".list>li div");

    $(window).on('load',function(){
        $keyword.css({display:"none"});
    });

    $list.on({
        'mouseenter':function(){
            let lstIdx = $list.index(this);

            if(lstIdx>15){
                lstIdx--;
                $keyword.eq(lstIdx).stop().slideDown();
            }else if(lstIdx<15){
                $keyword.eq(lstIdx).stop().slideDown();
            }
        }
        ,
        'mouseleave':function(){
            $keyword.stop().slideUp();
        }
    });
});