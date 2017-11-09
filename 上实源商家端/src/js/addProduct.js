function addProduct(){
	console.log('开始调用上传商品接口')
	//上传的图片
	var mainImgVal = $('#mainImgVal').val(),//主图回显路径
	 	subImgVal = $('#subImgVal').val();//幅图回显路径
	console.log('主图回显路径:'+mainImgVal);
	console.log('幅图回显路径:'+subImgVal);
	//上传短视频
	var uploadShortVideoVal = $('#uploadShortVideoVal').val(),//上传短视频,0:未开启，1:开启
		videoSrcVal = $('#videoSrcVal').val(),//上传短时频回显路径
		videoImgSrc = $('#videoImgSrc').val();//上传视频封面回显路径
	if(uploadShortVideoVal==0){//未开启上传视频
		console.log('未开启上传视频');
		videoSrcVal = '';
		videoImgSrc = ''
	}	
	console.log('上传短时频路径:'+videoSrcVal);
	console.log('上传视频封面路径:'+videoImgSrc);
	//声明变量
	var productName = $.trim($('#productName').val()),//商品标题
		productSubName = $.trim($('#productSubName').val()),//商品副标题
		showCategoryVal = $.trim($('#showCategoryVal').val()),//商品类目
		productPrice = $.trim($('#productPrice').val()),//商品价格
		stockNumber = $.trim($('#stockNumber').val());//商品库存数量
		
	//产地模块
	var provinceVal = $('#provinceVal').val(),//省份
		cityVal = $('#cityVal').val(),//地级市
		countyVal = $('#countyVal').val();//区县
	//规格模块
	var specNum = $.trim($('#specNum').val()),//数量
		showSpecVal = $('#showSpecVal').val(),//单位
		showUnitVal = $('#showUnitVal').val(),//包装种类
		spec = specNum + showSpecVal + '/' + showUnitVal;
	//包邮模块
	var freePostage = $('#freePostage').attr('checked'),//包邮按钮
		postageVal = $.trim($('#postageVal').val()),//邮费
		conditionPostagevVal = $('#conditionPostagevVal').val(),//条件包邮,0:未开启，1:开启
		showPostageVal = $('#showPostageVal').val(),//选择条件分类，1:根据件数，2:根据钱数，3:件数和地域限制，4:钱数和地域限制
		byNumberPostageVal = $.trim($('#byNumberPostageVal').val()),//案件数
		byPricePostageVal = $.trim($('#byPricePostageVal').val()),//按钱数
		showNotPostageDistrictVal = $('#showNotPostageDistrictVal').val();//不包邮地区
	if(freePostage == 'checked'){//包邮
		console.log('包邮')
		postageVal = 0;
		showPostageVal = 0;
		byNumberPostageVal = 0;
		byPricePostageVal = '';
		showNotPostageDistrictVal = '';
	}else if(freePostage===undefined){//不包邮
		showPostageVal = 0;
		byNumberPostageVal = 0;
		byPricePostageVal = '';
		showNotPostageDistrictVal = '';
		console.log('conditionPostagevVal：'+conditionPostagevVal)
		if(conditionPostagevVal==1){//开启条件包邮
			showPostageVal = $('#showPostageVal').val();
			switch(showPostageVal){//1:根据件数，2:根据钱数，3:件数和地域限制，4:钱数和地域限制
				case '1':
					byPricePostageVal = '';
					showNotPostageDistrictVal = '';
					break;
				case '2':
					byNumberPostageVal = 0;
					showNotPostageDistrictVal = '';
					break;
				case '3':
					byPricePostageVal = '';
					break;
				case '4':
					byNumberPostageVal = 0;
					break;
				default:
					console.log('其他')
			}
		}
	}
	//产品类型
	var publicationType = $('input[name=productType]:checked').val(),//发布产品类型，0普通，1预售
		reserveProductNum = $.trim($('#reserveProductNum').val()),//预定产品数量
		reserveTime = $.trim($('#reserveTime').val());//预定发货日期，时间戳格式
	if(publicationType==0){//普通商品
		console.log('普通');
		reserveProductNum = 0;
		reserveTime = '';
	}
	console.log('Url：'+Url)
	
//	byNumberPostageVal == '' ? byNumberPostageVal = 0 : byNumberPostageVal = byNumberPostageVal;
//	reserveProductNum == '' ? reserveProductNum = 0 : reserveProductNum = reserveProductNum;
//	conditionPostagevVal == '' ? conditionPostagevVal = 0 :conditionPostagevVal = conditionPostagevVal;
	
	console.log('parseInt(showCategoryVal)：'+parseInt(showCategoryVal))
	console.log('parseInt(stockNumber)：'+parseInt(stockNumber))
	console.log('parseInt(provinceVal)：'+parseInt(provinceVal))
	console.log('parseInt(cityVal)：'+parseInt(cityVal))
	console.log('parseInt(countyVal)：'+parseInt(countyVal))
	console.log('parseInt(showPostageVal)：'+parseInt(showPostageVal))
	console.log('parseInt(publicationType)：'+parseInt(publicationType))
	console.log('parseInt(reserveProductNum):'+parseInt(reserveProductNum))
	console.log('parseInt(byNumberPostageVal):'+parseInt(byNumberPostageVal))
	console.log('parseInt(reserveProductNum):'+parseInt(reserveProductNum))
	console.log('parseInt(conditionPostagevVal):'+parseInt(conditionPostagevVal))
	
	mui.ajax(Url+'/appproduct/AppAddProductMessage.do',{
		data:{
			token:'',//
			adminId:'',//商户Id
			categoryId:parseInt(showCategoryVal),//分组Id
			name:productName,//商品名称
			subtitle:productSubName,//副标题
			mainImage:mainImgVal,//主图
			subImages:subImgVal,//附图
			videocove:videoImgSrc,//视频封面图
			video:videoSrcVal,//视频文件
			price:productPrice,//价格
			stock:parseInt(stockNumber),//库存
			status:4,//商品状态
			postage:postageVal,//运费
			spec	:spec,//规格
			districtId:parseInt(provinceVal),//省
			city:parseInt(cityVal),//市
			county:parseInt(countyVal),//县/区
			conditionalMail:parseInt(showPostageVal),//条件包邮
			enoughNum:parseInt(byNumberPostageVal),//满多少件包邮
			enoughMoney:byPricePostageVal,//满多少钱包邮
			nocityMail:showNotPostageDistrictVal,//不包邮地区
			reserve:parseInt(publicationType),//普通/预定
			reserveDays:reserveTime,//预定天数
			reserveNum:parseInt(reserveProductNum)//预定数量
		},
		dataType:'json',
		type:'post',
		timeout:5000,
		success:function(json){
			alert('上传成功')
			console.log(json)
		},
		error:function(xhr,type,errorThrown){
			console.log('xhr：'+xhr);
			console.log('type:'+type);
			console.log('errorThrown:'+errorThrown)
			console.log(type);
			alert('上传失败')
		}
	});
}