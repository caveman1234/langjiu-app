//封装的全局方法 和组件
var isDevEnv = false;
var baseAdress = "https://c.langjiu.cn/" ;
// var baseAdress = "http://10.18.0.203:8080" ;
baseAdress = isDevEnv ? "" : baseAdress;
$(document).ready(function() {
	//返回按钮 关闭当前页面
	$(".back").click(function() {
		summer.closeWin();
	});
	//加loading
	$("body").append('<div style="display: none;background-color:#b6b6b6;position: absolute;top: 0;bottom: 0;width: 100%;opacity: 0.5;z-index:3000" id="loading"><div style="opacity: 1;width: 100px;margin-left: -50px;background-color: white;border-radius: 6px; position: absolute;top: 40%;left: 50%;text-align: center;padding: 20px;"><img src="../image/loading_more.gif" onerror="onerror=null;src=\'../../image/loading_more.gif\'" style="width: 50%;" /><p style="margin-top: 10px;opacity: 1;color: #000000;" id="loading_text">请稍等</p></div></div>');

	$(document).on("tap", "#imagecontent img", function() { //修改成这样的写法
		summer.openWin({
			id: "lookPhoto",
			url: "html/gongyong/LookPhoto.html",
			pageParam: {
				src: this.src
			}
		});
	});
});

//接口基地址 json参数 成功回调 返回回调 是否显示加载中
function doPost(adresses, para, successFun, errorFun, showLoding, getorpost) {
	if(summer.getSysInfo().systemType == "android") {
		//Android 6以上版本使用此API时需要手动申请权限
		summer.getPermission(["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"], function(args) {
			doPost_back(adresses, para, successFun, errorFun, showLoding, getorpost);
		}, function(args) {
			alert("没有获取到相应权限"); //失败返回illegal access
		});
	} else {
		doPost_back(adresses, para, successFun, errorFun, showLoding, getorpost);
	}
}

function doPost_back(adresses, para, successFun, errorFun, showLoding, getorpost) {
	//設置延遲超時時間
	window.cordovaHTTP.settings = {
		timeout: 5000
	};
	if(!errorFun) {
		errorFun = function(we) {
			alert(we);
		}
	}
	if(showLoding) {
		showLoadingBar();
	}
	var adress = baseAdress + adresses;
	summer.ajax({
		type: getorpost || "post",
		url: adress,
		param: para,
		header: {}
	}, function(data) {
		hideLoadingBar();
		
		var header = JSON.parse(JSON.stringify(data.headers).replace(/-/g,""));
		if(header.XOCMcode != 1) {
			errorFun("提示:"+decodeURI(header.XOCMmessage));
		} else {
			var datas;
			try {
				datas = JSON.parse(data.data);
			} catch(e) {
				datas = data.data;
			}
			successFun(datas);
		}
	}, function(data) {
		hideLoadingBar();
		errorFun("访问服务器出错,请检查网络连接:" + JSON.stringify(data));
	});

}

//重新定义alert
function alert(content, fun,title) {
	mui.alert(content,title||"提示", function() {
		if(typeof fun === "function") {
			fun();
		}
	});
}
//toast
function toast(content) {
	mui.toast(content);
}

//显示loading
function showLoadingBar(texts) {
	$("#loading_text").text(texts || "加载中..");
	$("#loading").show();
}

function hideLoadingBar() {
	$("#loading").hide();
}
//写入缓存
function writeStorage(names, value, fun) {
	if(summer.getSysInfo().systemType == "android") {
		summer.getPermission(["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"], function(args) {
			writeStorage_back(names, value, fun);
		}, function(args) {
			alert("没有获取到写入数据权限"); //失败返回illegal access
		});
	} else {
		writeStorage_back(names, value, fun);
	}
}

function writeStorage_back(names, value, fun) {
	summer.setStorage(names, value);
	if(fun) {
		fun();
	}
}
//读取缓存
function readStorage(names, fun) {
	if(summer.getSysInfo().systemType == "android") {
		summer.getPermission(["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"], function(args) {
			readStorage_back(names, fun);
		}, function(args) {
			alert("没有获取到写入数据权限"); //失败返回illegal access
		});
	} else {
		readStorage_back(names, fun);
	}
}

function readStorage_back(names, fun) {
	fun(summer.getStorage(names));
}
//下载文件
function downFile(url, filename, back) {
	if(summer.getSysInfo().systemType == "android") {
		summer.getPermission(["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"], function(args) {
			downFile_back(url, filename, back);
		}, function(args) {
			alert("没有获取到写入数据权限"); //失败返回illegal access
		});
	} else {
		downFile_back(url, filename, back);
	}
}

function downFile_back(url, filename, back) {
	summer.download({
		"url": url,
		"locate": "yonyou/file",
		"filename": filename,
		"override": "true",
		"callback": back
	});
}
//打开文件
function openFile(names, type, path) {
	summer.openFile({
		filename: names,
		filetypeL: type,
		filepath: path
	});
}
//打开网页
function openwebview(urls) {
	if(summer.getSysInfo().systemType == "android") {
		summer.getPermission(["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE","android.permission.READ_PHONE_STATE"], function(args) {
			openwebviewBack(urls);
		}, function(args) {
			alert("没有获取到权限"); //失败返回illegal access
		});
	} else {
		openwebviewBack(urls);
	}
}
function openwebviewBack(urls){
	summer.openWebView({
	    url : urls
	});
}
//更新app
function updateApp(url){
	if(summer.getSysInfo().systemType == "android") {
		summer.getPermission(["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE","android.permission.READ_PHONE_STATE"], function(args) {
			updateAppBack(url);
		}, function(args) {
			alert("没有获取到权限"); //失败返回illegal access
		});
	} else {
		updateAppBack(url);
	}
}
function updateAppBack(url){
	summer.upgradeApp({
	    url:url
	},function(ret){
	},function(ret){
		alert(ret.msg);
	})
}
