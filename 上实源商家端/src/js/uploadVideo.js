mui.plusReady(function(){
	//添加视频
	document.getElementById('addVideoFileBtn').addEventListener('tap', function() {
		var len = $('.videoFileBox').length;
		if(len>=1){
			alert('短视频最多上传 1 段')
		}else{
			showActionSheetVideo('addVideoFileBtn');
		}
	});
	//上传视频封面图
	document.getElementById('addVideoImgBtn').addEventListener('tap', function() {
		var len = $('.videoImgBox').length;
		if(len>=1){
			alert('短视频封面图最多 1 张')
		}else{
			showActionSheet('addVideoImgBtn');
		}
	});
})
//存放视频封面图数组
var videoFiles = [];
//初始上传地址 
var server = "http://192.168.1.200:8082/APPMerchant/appfileupload/appfileupload.do";

var index = 2;
//弹出系统选择框 选择拍摄视频或者相册选取视频
function showActionSheetVideo(conf) {
	var divid = conf;
	console.log('divid:'+divid)
	var actionbuttons = [{
		title: "拍摄视频"
	}, {
		title: "相册选取"
	}];
	var actionstyle = {
		title: "选择视频",
		cancel: "取消",
		buttons: actionbuttons
	};
	plus.nativeUI.actionSheet(actionstyle, function(e) {
		if (e.index == 1) {
			getVideo(divid);
		} else if (e.index == 2) {
			galleryVideo(divid);
		}
	});
}
//调用相册视频
function galleryVideo(divid){
	plus.gallery.pick( function(p){ 
        plus.io.resolveLocalFileSystemURL(p, function(entry){
        		entry.file(function(file){
                // 数据只能在该函数内部显示
                var fileSize = file.size * 100 / 1024 / 100
                console.log("原始文件大小：" + fileSize +"KB   filename:"+file.name);
                var quality = 90;
                if(fileSize<200){
                		alert('请上传视频大于200kb');
                		return false;
                }
                if(fileSize>=10240){
                		alert('上传视频太大，超过10M');
                		return false;
                }
                createItem(p,divid);
            })
        });
    }, function ( e ) {  
        console.log( "取消选择视频" );  
    }, {filter:"video"} ); 
}
//调用相机
var cmr=null;
function getVideo(divid){
    cmr = plus.camera.getCamera();
	cmr.startVideoCapture(function(p){
		plus.io.resolveLocalFileSystemURL(p, function(entry){
			console.log('entry.name:'+entry.toLocalURL());
			entry.file(function(file){
				// 数据只能在该函数内部显示
	            var fileSize = file.size * 100 / 1024 / 100
	            console.log("原始文件大小：" + fileSize +"KB   filename:"+file.name);
	            var quality = 90;
	            if(fileSize<200){
	            		alert('请上传视频大于200kb');
	            		return false;
	            }
	            if(fileSize>=10240){
	            		alert('上传视频太大，超过10M');
	            		return false;
	            }
				createItem(entry.toLocalURL(),divid);
			})
		}, function(e){
			outLine('读取录像文件错误：'+e.message);
		} );
	}, function(e){
		outLine('失败：'+e.message);
	}, {filename:'_doc/camera/',index:1});
	setTimeout( stopCapture, 10000 );
}
// 停止摄像
function stopCapture(){
	console.log("stopCapture");
	cmr.stopVideoCapture();
}
// 添加播放项
function createItem(src,divid){
	console.log('divid:'+divid)
	$('#'+divid).before('<span class="videoFileBox">'+
							'<img id="playVideo" data-source="'+src+'" class="play" src="../images/icon/015.png" alt="" />'+
							'<em class="delVideoBtn">'+
								'<img src="../images/icon/014.png" alt="" />'+
							'</em>'+
						'</span>');
	$('#'+divid).siblings('.error').fadeOut(0);
//	document.getElementById("video").src=src;
} 

// 添加文件
function appendVideoFile(){
	videoFiles = [];
	
	var lenVideoFile = $('.videoFileBox').length;
	var lenVideoImg  = $('.videoImgBox').length;
	
	if(lenVideoFile==0){
		$('#addVideoFileBtn').next('.error').fadeIn(0);
	};
	if(lenVideoImg==0){
		$('#addVideoImgBtn').next('.error').fadeIn(0);
	};
	
	if(lenVideoFile>0&&lenVideoImg>0){
		videoFiles.push({
			name: "VidoUploadkey_" + 0,
			path: $('#playVideo').attr('data-source')
		});
		var src = $('.videoImgBox').find('img').attr('src');
		videoFiles.push({
			name: "VidocUploadkey" + 1,
			path: src
		});
		console.log('上传数组:'+JSON.stringify(videoFiles));
		uploadVideo()
	};
}
// 上传文件
function uploadVideo(){
	var wt=plus.nativeUI.showWaiting();
	var task=plus.uploader.createUpload(server,
		{method:"POST"},
		function(t,status){ //上传完成
			if(status==200){
				console.log('上传成功:'+JSON.stringify(t));
                console.log("上传段视频成功："+t.responseText);
                
                var basic = t.responseText;
               	var videoArr = basic.substr(0, basic.length - 1).split(',');//上传商品主图幅图回显数组
               	console.log('上传视频回显数组：'+JSON.stringify(videoArr));
               	
               	$('#videoSrcVal').val(videoArr[0]);//视频文件
               	$('#videoImgSrc').val(videoArr[1]);//视频封面图
				wt.close();
				addProduct()//调用上传商品函数
			}else{
				console.log("上传失败："+status);
				wt.close();
			}
		}
	);
	for(var i=0;i<videoFiles.length;i++){
		var f=videoFiles[i];
		task.addFile(f.path,{key:f.name});
	}
	task.start();
}

// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
}

//删除图片
mui('body').on('tap', '.delVideoBtn', function() {
	$(this).parents('span').remove();
});

mui('body').on('tap','#playVideo',function(){
	console.log('触发了播放按钮');
	var src = $(this).attr('data-source');
})

