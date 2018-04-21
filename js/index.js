var mask = mui.createMask(); //callback为用户点击蒙版时自动执行的回调;
var icanShowMore = document.getElementsByClassName('ican-show-more');
var icanShowImage = document.getElementsByClassName('ican-show-image');
var showImg = document.getElementById('showImg');
var icanShowUl = document.getElementsByClassName('ican-show-ul')[0];

/*当前容量 温度*/
saveCapacity = 67.8;
saveTemperature = 25.2;


var options = {  
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    prefix: '',
    suffix: ''
}
function loadUpdate() {
    var demo1 = new countUp("ican-capacity", 0, saveCapacity, 1, 2.5, options);
    demo1.start(); 
    var demo2 = new countUp("ican-temperature", 0, saveTemperature, 1, 2.5, options);
    demo2.start();
    var newtime = new Date();
        var hour = newtime.getHours();
        var minute = newtime.getMinutes();
        var second = newtime.getSeconds();
        if(hour <= 9) {
            hour = '0' + hour
        }
        if(minute <= 9) {
            minute = '0' + minute
        }
        if(second <= 9) {
            second = '0' + second
        }

        for(var i=0; i<document.getElementsByClassName('ican-update-time').length; i++) {
            document.getElementsByClassName('ican-update-time')[i].innerHTML = '更新于：' + hour +': '+ minute +': '+ second;
        }
        document.getElementsByClassName('ican-swiper-span')[0].innerHTML = saveCapacity + '%';
        document.getElementsByClassName('ican-swiper-span')[1].innerHTML = saveTemperature + '℃';
}

loadUpdate();

function changeCapAndTemp(newCap,newTemp) {
    if(newCap != saveCapacity) {
        var demo1 = new countUp("ican-capacity", saveCapacity, newCap, 1, 2.5, options);
        demo1.start();  
        saveCapacity = newCap;
    }

    if(newTemp != saveTemperature) {
        var demo2 = new countUp("ican-temperature", saveTemperature, newTemp, 1, 2.5, options);
        demo2.start();
        saveTemperature = newTemp;
    }    

    var newtime = new Date();
    var hour = newtime.getHours();
    var minute = newtime.getMinutes();
    var second = newtime.getSeconds();
    if(hour <= 9) {
        hour = '0' + hour
    }
    if(minute <= 9) {
        minute = '0' + minute
    }
    if(second <= 9) {
        second = '0' + second
    }

    for(var i=0; i<document.getElementsByClassName('ican-update-time').length; i++) {
        document.getElementsByClassName('ican-update-time')[i].innerHTML = '更新于：' + hour +': '+ minute +': '+ second;
    }

    document.getElementsByClassName('ican-swiper-span')[0].innerHTML = newCap + '%';
    document.getElementsByClassName('ican-swiper-span')[1].innerHTML = newTemp + '℃';
}

var testNumChangeTimer = setTimeout(function() {
    changeCapAndTemp(28.9,62.7);
},8000)

function connect(sendData) {  
    if (ws != null) {  
        console.log("现已连接");  
        console.log(ws)
        return ;  
    }  
    url = "ws://192.168.1.211/getnodestatus";  
    if ('WebSocket' in window) {  
        ws = new WebSocket(url);  
    } else {  
        alert("您的浏览器不支持WebSocket。");  
        return ;  
    }  
    ws.onopen = function() {            
        //发送一个字符串
        ws.send(sendData);  
    }  
    ws.onmessage = function(evt) {  
        console.log(evt);
        // 判断是容量还是类型
        if(sendData.split(':')[0] == 'status') {
            savePer = evt.data;
        }else if(sendData.split(':')[0] == 'history') {
            // 判断是否有值
            if(evt.data !== '') {
                // 0  报警  1 可回收  2不可回收
                // .split(',')[0]
                if(saveHistory == evt.data) {
                    //nothing
                }else {
                    // saveHistory = evt.data.split(',')[0];
                    saveHistory = evt.data;
                    // console.log('来了')
                    var arr = evt.data.split(',');
                    // console.log(evt.data)
                    //时间
                    var newtime = new Date(Number(arr[0]));
                    var year = newtime.getFullYear();
                    var month = newtime.getMonth() + 1;
                    var day = newtime.getDate();
                    var hour = newtime.getHours();
                    var minute = newtime.getMinutes();
                    var second = newtime.getSeconds();
                    if(hour <= 9) {
                        hour = '0' + hour
                    }
                    if(minute <= 9) {
                        minute = '0' + minute
                    }
                    if(second <= 9) {
                        second = '0' + second
                    }

                    var appendTime = year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
                    // 类型
                    var type;

                    if(arr[1] == 0) {
                        type = '报警'    
                    }else if(arr[1] == 1) {
                        type = '可回收'
                    }else if(arr[1] == 2) {
                        type = '不可回收'
                    }
                    // console.log(appendTime,type)
                    addChild1(appendTime,type);
                }
            }
        }   
    }  
    // ws.onclose = function(e) {  
    //     log("closed");  
    // }  
    ws.onerror = function(e) {  
        console.log("error");  
    }  
} 

/*记录当前点击的索引号*/
var thisShowMore = 0;
var thisShowImage = 0;


/*提交反馈信息*/
function updateShowMore() {
    for (var i = 0; i < icanShowMore.length; i++) {
        icanShowMore[i].index = i;
        icanShowMore[i].addEventListener('tap', function () {
            thisShowMore = this.index;
            console.log(thisShowMore)
        }, false);
        icanShowMore[i].addEventListener('tap', clickShowMore, false);
    }
}

function clickShowMore() {
    // console.log(this);
    var that = icanShowMore[thisShowMore];
    // console.log(icanShowMore[i]);
    if (icanShowMore[thisShowMore].getAttribute('data-bol') == 'true') {
        // console.log('true');
        var btnArray = '确定';
        mui.alert('已提交', 'iCan智能垃圾桶', btnArray, function (e) {})
    } else {
        var btnArray = ['错误', '正确', '取消'];
        mui.confirm('此次识别是否正确?', 'iCan智能垃圾桶', btnArray, function (e) {

            if (e.index == 1) {
                that.setAttribute('data-bol', 'true')
                console.log('谢谢您的支持!');
            } else if (e.index == 0) {
                that.setAttribute('data-bol', 'true')
                console.log('谢谢您的反馈,我们会继续努力改进的');
            } else {
                console.log('用户取消')
            }
        })
    }
}

updateShowMore();

/*显示拍照图片*/
function updateShowImage() {
    for (var i = 0; i < icanShowImage.length; i++) {
        icanShowImage[i].index = i;
        icanShowImage[i].addEventListener('tap', function () {
            thisShowImage = this.index;
            console.log(thisShowImage)
        }, false);
        icanShowImage[i].addEventListener('tap', clickShowImage, false);
    }
}

function clickShowImage(e) {
    showImg.children[0].src = '';
    e.stopPropagation();
    var imgSrc = icanShowImage[thisShowImage].getAttribute('data-src');
    mask.show();
    showImg.children[0].src = imgSrc;
    showImg.style.opacity = 1;
    showImg.style.zIndex = 999;
}

updateShowImage();

/*移除添加的tap事件*/
function removeShowMore() {
    for (var i = 0; i < icanShowImage.length; i++) {
        icanShowImage[i].removeEventListener('tap', clickShowMore, false);
    }

    for (var i = 0; i < icanShowMore.length; i++) {
        icanShowMore[i].removeEventListener('tap', clickShowImage, false);
    }
}


/*阻止用户点击图片的默认事件*/
document.getElementsByClassName('ican-toast-img')[0].addEventListener('tap', function (e) {
    e.stopPropagation();
})

/*document点击的默认事件*/
document.body.addEventListener('tap', function (e) {
    mask.close();
    showImg.style.opacity = 0;
    showImg.style.zIndex = -1;
})

var showArr = ['时间：2018-4-16 16:03', '类型：不可回收', 'http://img1.3lian.com/img013/v2/35/d/43.jpg', 'false'];

var timer = setInterval(function () {
    if (icanShowUl.children.length > 20) {
        icanShowUl.removeChild(icanShowUl.children[icanShowUl.children.length - 1])
    }
    // li
    var myLi = document.createElement('li');
    myLi.className = 'mui-table-view-cell mui-media';

    // li > a
    var myA = document.createElement('a');
    myA.className = 'mui-navigate-right';

    // li > a > img
    var myImg = document.createElement('img');
    myImg.className = 'mui-media-object mui-pull-left';
    myImg.src = './images/star.jpg';

    // li > a > div
    var myData = document.createElement('div');
    myData.className = 'mui-media-body';
    // li > a > div > p
    var myTime = document.createElement('p');
    var myType = document.createElement('p');

    myTime.innerHTML = new Date();
    myType.innerHTML = showArr[1];

    myData.appendChild(myTime);
    myData.appendChild(myType);

    // li > a > div
    var myImgIcon = document.createElement('div');
    myImgIcon.className = 'ican-show-image';
    myImgIcon.setAttribute('data-src', showArr[2]);
    // li > a > div > span
    var myImgIconSpan = document.createElement('span');
    myImgIconSpan.className = 'fa fa-image fa-2x';

    myImgIcon.appendChild(myImgIconSpan);

    // li > a > div
    var myToastIcon = document.createElement('div');
    myToastIcon.className = 'ican-show-more';
    myToastIcon.setAttribute('data-bol', showArr[3]);
    // li > a > div > span
    var myToastIconSpan = document.createElement('span');
    myToastIconSpan.className = 'fa fa-ellipsis-h fa-2x';

    myToastIcon.appendChild(myToastIconSpan);

    myA.appendChild(myImg);
    myA.appendChild(myData);
    myA.appendChild(myImgIcon);
    myA.appendChild(myToastIcon);

    myLi.appendChild(myA);

    if (icanShowUl.children.length == 0) {
        icanShowUl.appendChild(myLi);
        removeShowMore();
        updateShowMore();
        updateShowImage();

    } else {
        icanShowUl.insertBefore(myLi, icanShowUl.children[0]);
        removeShowMore();
        updateShowMore();
        updateShowImage();
    }

}, 3000000);