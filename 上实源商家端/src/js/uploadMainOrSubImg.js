
mui.plusReady(function(){
	//上传主图
	document.getElementById('addMainImgBtn').addEventListener('tap', function() {
		var len = $('.mainImgBox').length;
		if(len>=1){
			alert('商品主图最多上传 1 张')
		}else{
			showActionSheet('addMainImgBtn');
		}
	});
	//上传幅图
	document.getElementById('addSubImgBtn').addEventListener('tap', function() {
		var len = $('.subImgBox').length;
		if(len>=5){
			alert('商品幅图最多上传 5 张')
		}else{
			showActionSheet('addSubImgBtn');
		}
	})
})
//存放幅图数组
var files = [];
//初始上传地址 
var server = "http://192.168.1.200:8082/APPMerchant/appfileupload/appfileupload.do";

var index = 1;
//弹出系统选择框 选择拍照或者相册
function showActionSheet(conf) {
//				console.log(JSON.stringify(conf));
	var divid = conf;
	console.log('divid:'+divid)
	var actionbuttons = [{
		title: "拍照"
	}, {
		title: "相册选取"
	}];
	var actionstyle = {
		title: "选择照片",
		cancel: "取消",
		buttons: actionbuttons
	};
	plus.nativeUI.actionSheet(actionstyle, function(e) {
		if (e.index == 1) {
			getImage(divid);
		} else if (e.index == 2) {
			galleryImg(divid);
		}
	});
}
//相机选取照片
function getImage(divid) {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			compressImage(entry.toLocalURL(), entry.name, divid);
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {}, {
		filename: "_doc/camera/",
		index: 1
	});
}
//相册选取照片
function galleryImg(divid) {
	plus.gallery.pick(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var fileSize = 0;
			//图片压缩函数
			entry.file(function(file){
                // 数据只能在该函数内部显示
                fileSize = file.size * 100 / 1024 / 100
                console.log("原始文件大小：" + fileSize +"KB   filename:"+file.name);
                var quality = 90;
                if(fileSize<200){
                		alert('请上传图片大于200kb');
                		return false;
                }
                if(fileSize>=10240){
                		alert('上传图片太大');
                		return false;
                }
                	console.log('quality:'+quality)
                compressImage(entry.toLocalURL(), entry.name, divid);
            })
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {}, {
		filename: "_doc/camera/",
		filter: "image"
	});
}
//图片压缩函数
function compressImage(url, filename, divid,quality) {
	$('#'+divid).siblings('.error').fadeOut(0);
	var name = "_doc/upload/" + divid + "-" + filename; //_doc/upload/F_ZDDZZ-1467602809090.jpg 
	plus.zip.compressImage({
		src: url,
		//src: (String 类型 )压缩转换原始图片的路径 
		dst: name,
		//压缩转换目标图片的路径 
		quality: 20,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100 
		overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
	}, function(event) {
		console.log('event:'+JSON.stringify(event))
		//uploadf(event.target,divid); 
		var path = name; //压缩转换目标图片的路径 
		//event.target获取压缩转换后的图片url路 
		//filename图片名称 
		var size = event.size * 100 / 1024 / 100;
		console.log('压缩后size:'+size)
		saveimage(event.target, divid, filename, path);
	}, function(error) {
		plus.nativeUI.toast("压缩图片失败，请稍候再试");
	});
}
//图片保存到本地函数
function saveimage(url, divid, name, path) {
//				alert('图片保存到本地函数')
	var state = 0;
	var wt = plus.nativeUI.showWaiting();
	// plus.storage.clear(); 
	name = name.substring(0, name.indexOf(".")); //图片名称：1467602809090 
	var id = getUid();//调用一个随机数
	var itemname = id + "img-" + divid; //429img-F_ZDDZ 
	var itemvalue = plus.storage.getItem(itemname);
	if (itemvalue == null) {
		itemvalue = "{" + name + "," + path + "," + url + "}"; //{IMG_20160704_112614,_doc/upload/F_ZDDZZ-IMG_20160704_112614.jpg,file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg} 
	} else {
		itemvalue = itemvalue + "{" + name + "," + path + "," + url + "}";
	}
	plus.storage.setItem(itemname, itemvalue);
	// var src = 'src="'+url+'"'; 
	var src = url;
	showImgDetail(name, divid, id, src);
	wt.close();
}
//将图片在本地显示出来
function showImgDetail(imgId, imgkey, id, src) {
//				alert('将图片在本地显示出来')
	if(imgkey=='addSubImgBtn'){
		$('#'+imgkey).before('<span class="subImgBox">'+
								'<img src="'+src+'" alt="" data-preview-src="" data-preview-group="1"/>'+
								'<em class="delImgBtn">'+
									'<img src="../images/icon/014.png" alt="" />'+
								'</em>'+
							'</span>')
	}else if(imgkey=='addMainImgBtn'){
		$('#'+imgkey).before('<span class="mainImgBox">'+
								'<img src="'+src+'" alt=""  data-preview-src="" data-preview-group="0"/>'+
								'<em class="delImgBtn">'+
									'<img src="../images/icon/014.png" alt="" />'+
								'</em>'+
							'</span>')
		
	}else if(imgkey=='addVideoImgBtn'){
		$('#'+imgkey).before('<span class="videoImgBox">'+
									'<img src="'+src+'" alt="" data-preview-src="" data-preview-group="2"/>'+
									'<em class="delVideoBtn">'+
										'<img src="../images/icon/014.png" alt="" />'+
									'</em>'+
								'</span>')
	}
}
//上传图片文件放入数组
function upload_img() {
	files = [];
//				alert('上传图片文件放入数组')
	var lenMain = $('.mainImgBox').length;
	var lenSub  = $('.subImgBox').length;
	if(lenMain==0){
		$('#addMainImgBtn').next('.error').fadeIn(0);
	};
	if(lenSub==0){
		$('#addSubImgBtn').next('.error').fadeIn(0);
	};
	if(lenMain>0&&lenSub>0){
		files.push({
			name: "MainUploadkey_" + 0,
			path: $('.mainImgBox').find('img').attr('src')
		});
		$('.subImgBox').each(function(index){
			var src = $(this).find('img').attr('src');
			files.push({
				name: "subUploadkey_" + index,
				path: src
			});
		});
		console.log('上传数组:'+JSON.stringify(files));
		start_upload()
	};
}
//开始上传
function start_upload() {
//				alert('开始上传')
	//判断下是否有照片在数组中
	if (files.length <= 0) {
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
	//原生的转圈等待框
	var wt = plus.nativeUI.showWaiting();
	var task=plus.uploader.createUpload(server,
        {method:"POST"},
        function(t,status){ //上传完成
            if(status==200){
            		console.log('上传成功:'+JSON.stringify(t));
               	var basic = t.responseText;
               	var imgArr = basic.substr(0, basic.length - 1).split(',');//上传商品主图幅图回显数组
               	console.log('上传商品主图幅图回显数组：'+JSON.stringify(imgArr));
               	
               	$('#mainImgVal').val(imgArr[0]);//商品主图
               	
               	imgArr.shift();
               	var subImgSrc = imgArr.join(',');
               	$('#subImgVal').val(subImgSrc);//商品幅图
               	
                wt.close(); //关闭等待提示按钮
                var uploadShortVideoVal = $('#uploadShortVideoVal').val();//上传短视频,0:未开启，1:开启
                if(uploadShortVideoVal==0){//未开启上传视频
					addProduct()//调用上传商品函数
				}else if(uploadShortVideoVal==1){//开启上传视频
					appendVideoFile();//调用上传视频
				}
                
            }else{
                alert("上传失败："+status);
                wt.close();//关闭等待提示按钮
            }
        }
    );
	//addData 添加上传数据
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		console.log('task:'+JSON.stringify(task));
		//addFile 添加上传文件
		task.addFile(f.path, {key: f.name});
	}
	//执行上传
	task.start();
}

// 产生一个随机数  
function getUid() {  
    return Math.floor(Math.random() * 100000000 + 10000000).toString();  
}

//删除图片
mui('body').on('tap', '.delImgBtn', function() {
	var mainStates = $(this).parents('span').hasClass('mainImgBox');
	console.log('files.length:'+files.length)
	if(files.length>0){//提交后创建了files数组后在删除
		if(mainStates){	//点击按钮为删除主图
			$('.mainImgBox').remove();
			files.splice(0,1)
		}else{//点击按钮删除幅图
			if($('.mainImgBox').length>0){//主图还在情况下，删除幅图
				var index = $(this).parents('span').index();
				console.log('index:'+(index+1));
				files.splice((index+1),1)
				$(this).parents('span').remove();
			}else{//主图不在的情况下，删除幅图
				var index = $(this).parents('span').index();
				console.log('index:'+(index+1));
				files.splice((index+1),1)
				$(this).parents('span').remove();
			}
		}
	}else{//未创建files数组
		if(mainStates){//删除主图
			$('.mainImgBox').remove();
		}else{//删除幅图
			$(this).parents('span').remove();
		}
	}
});
