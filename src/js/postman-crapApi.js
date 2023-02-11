$(function(){
    getLocalModules();
    //getHistorys();
    //openMyDialog("title",500);
    var pageName = getValue("id-page-name")
    if (pageName == "debug"){
        //$("#left").width(getMenuWidth() + '%');
        //$("#right").width((100- getMenuWidth()) + '%');

        refreshSyncIco(-1);
        //getLoginInfoDAO(drawLoginInfoDAO);

        // 当前环境
        drawCurrentEnv();
        drawNotice();
        drawCurrentProject();
        // 刷新
        var projectUniKey = getCurrentProjectUniKey();
        var modules = getLocJsonData(CRAP_DEBUG_MODULES + projectUniKey, EMPTY_ARRAY);
        if (modules.length == 0){
            //syncProject();
        }
    } else if (pageName == "setting"){
        $("#" + WEB_SITE_URL).val(getWebSiteUrl());
        $("#" + WEB_HTTP_TIMEOUT).val(getHttpTimeout());
        $("#" + SETTING_LANGUAGE).val(getLanguage());
        $("#" + MENU_WIDTH).val(getMenuWidth());
    } else if (pageName == "json"){
        $("#response-row").focus();
    }

    // 数据同步服务器
    $("#synch").click(function() {
        syncProject();
    });

    $("#id-search").keyup(function(event){
        if (event != null && event.keyCode != 13){
            return;
        }

        var value = $.trim(getValue("id-search-text"));
        if (hasClass("modules", "none")){
            searchHistorys(value);
        } else {
            searchLocalModules(value);
        }
    });

    $("#id-clear-search").click(function(){
        setValue("id-search-text", "");
        getLocalModules();
    });



    $("#historys-title").click(function(){
        $("#historys").removeClass("none");
        $("#modules").addClass("none");
        $("#modules-title").removeClass("bb2");
        $(this).addClass("bb2");
        getHistorys();
    });
    $("#modules-title").click(function(){
        $("#historys").addClass("none");
        $("#modules").removeClass("none");
        $("#historys-title").removeClass("bb2");
        $(this).addClass("bb2");
        getLocalModules();
    });

    var saveAs = true;
    // 保存
    $("#save-interface").click(function(){
        if( handerStr($("#interface-id").val()) == "" || handerStr($("#module-id").val())== ""){
            saveAs = false;
            intitSaveInterfaceDialog();
        }else{
            // 直接保存
            $("#save-interface-name").val($("#interface-name").val());
            var moduleId = $("#module-id").val();
            if( saveInterface(moduleId) ){
                alert(getText(l_successTip));
            }
        }
    });

    // 另存为
    $("#save-as-interface").click(function(){
        saveAs = true;
        intitSaveInterfaceDialog();
    });

    $("#save-interface-submit").click(function(){
        saveInterface("", saveAs);
    });

    $(".close-dialog").click(function(){
        var id = $(this).attr("crap-data");
        closeMyDialog(id);
    });
    $("#clear-local-data").click(function(){
        if(!myConfirm(getText(l_clearLocalData))){
            return false;
        }
        clearLocalStorage(getCurrentProjectUniKey());
        getLocalModules();
        $.ajax({
            type : "POST",
            url : getWebSiteUrl()+"/user/loginOut.do",
            async : true,
            data : "",
            complete: function(responseData, textStatus){
                if(textStatus == "error"){
                    alert(getText(l_clearSuccessLogoutFail), 5, "error", 500);
                }
                else if(textStatus == "success"){
                    alert(getText(l_clearSuccessLogoutSuccess), 5, "success", 500);
                }else{
                    alert(getText(l_clearSuccessLogoutFail), 5, "error", 500);
                }
                $("#float").fadeOut(300);
            }
        });
    });

    // 模块标题点击
    $("#modules").on("click",".panel-heading", function(e) {
        if ($(this).find("div").hasClass("collapsed")){
            $(".module-title-ico").html("&#xe615;");
            $(this).find(".module-title-ico").html("&#xe624;");
        } else {
            $(this).find(".module-title-ico").html("&#xe615;");
        }
    });

    $("#modules").on("click",".interface", function() {
        var urlInfo = $.parseJSON( decodeURIComponent($(this).attr("crap-data")) );
        $("#url").val(urlInfo.url);
        $("#interface-id").val(urlInfo.id);
        $("#module-id").val(urlInfo.moduleId);
        $("#interface-name").val(handerStr(urlInfo.name));
        $("#headers-bulk").val(urlInfo.headers);
        $("#method").val(urlInfo.method);
        $("#method").change();

        if($.inArray(urlInfo.paramType, customerTypes) == -1){
            urlInfo.paramType = "x-www-form-urlencoded;charset=UTF-8";
            $("#param-type-value").prop("checked",true);
            $("#params-bulk").val(urlInfo.params);
            $(".key-value-edit").click();
        }else{
            $("#customer-type-value").prop("checked",true);
            // 下拉选择 customer-type
            $("#customer-type").val(urlInfo.paramType);
            $("#customer-type").change();
            $("#customer-value").val(urlInfo.params);
            $("#headers-bulk-edit-div .key-value-edit").click();
        }
        $("input[name='param-type']").change();

        $(".interface").removeClass("bg-main");
        $(this).addClass("bg-main");

        hiddenDiv(ID_WEB_EDIT_INTERFACE);
        hiddenDiv(ID_WEB_VIEW_INTERFACE);
        // 编辑、查看接口
        if (urlInfo.webModuleId != null && urlInfo.webProjectId != null && urlInfo.webId != null){
            setAttr(ID_WEB_EDIT_INTERFACE, ATTR_HREF_PARAMS, urlInfo.webProjectId + "|" + urlInfo.webId);
            setAttr(ID_WEB_VIEW_INTERFACE, ATTR_HREF_PARAMS, urlInfo.webProjectId + "|" + urlInfo.webId);
            showDiv(ID_WEB_EDIT_INTERFACE);
            showDiv(ID_WEB_VIEW_INTERFACE);
        }
    });

    $("#historys").on("click","div", function() {
        hiddenDiv(ID_WEB_EDIT_INTERFACE);
        hiddenDiv(ID_WEB_VIEW_INTERFACE);

        var urlInfo = $.parseJSON( decodeURIComponent($(this).attr("crap-data")) );
        $("#url").val(urlInfo.url);
        $("#interface-id").val("-1");
        $("#module-id").val("-1");
        $("#interface-name").val(handerStr(urlInfo.name));
        $("#headers-bulk").val(urlInfo.headers);
        $("#method").val(urlInfo.method);
        $("#method").change();

        if($.inArray(urlInfo.paramType, customerTypes) == -1){
            urlInfo.paramType = "x-www-form-urlencoded;charset=UTF-8";
            $("#param-type-value").prop("checked",true);
            $("#params-bulk").val(urlInfo.params);
            $(".key-value-edit").click();
        }else{
            $("#customer-type-value").prop("checked",true);
            // 下拉选择 customer-type
            $("#customer-type").val(urlInfo.paramType);
            $("#customer-type").change();
            $("#customer-value").val(urlInfo.params);
            $("#headers-bulk-edit-div .key-value-edit").click();
        }
        $("input[name='param-type']").change();


        $(".history-div").removeClass("bg-main");
        $(this).addClass("bg-main");
    });

    $("#new-interface").click(function() {
        hiddenDiv(ID_WEB_EDIT_INTERFACE);
        hiddenDiv(ID_WEB_VIEW_INTERFACE);

        $("#interface-name").val("");
        $("#headers-bulk").val("");
        $("#params-bulk").val("");
        $("#url").val("");
        $("#interface-id").val("-1");
        $("#module-id").val("-1");
        $("#method").val("GET");
        $("#method").change();

        $("#param-type-value").prop("checked",true);
        $("#params-bulk").val("");
        $(".key-value-edit").click();
        $("input[name='param-type']").change();

        $(".interface").removeClass("bg-main");
        $(".history-div").removeClass("bg-main");
    });
    $("#save-module-submit").click(function() {
       if($("#rename-module-name").val() == ""){
           alert(getText(l_moduleNameIsNullTip), 5, "error", 300);
           return false;
       }
        renameModule( $("#rename-module-id").val(), $("#rename-module-name").val());
        getLocalModules();
        closeMyDialog("dialog2");
    });

    /******删除接口*********/
	$("#modules").on("click",".delete-interface", function() {
        if(!myConfirm(getText(l_confirmDelete)))
        {
            return false;
        }
        var ids = $(this).attr("crap-data").split("|");
		deleteInterface(ids[0],ids[1]);
		getLocalModules();	
		return false;// 不在传递至父容器
    });
    /*******上移接口**********/
    $("#modules").on("click",".up-interface", function() {
        var ids = $(this).attr("crap-data").split("|");
        upInterface(ids[0],ids[1]);
        getLocalModules();
        return false;// 不在传递至父容器
    });
    /*******下移接口**********/
    $("#modules").on("click",".down-interface", function() {
        var ids = $(this).attr("crap-data").split("|");
        downInterface(ids[0],ids[1]);
        getLocalModules();
        return false;// 不在传递至父容器
    });

    $("#modules").on("click",".delete-module", function() {
        if(!myConfirm(getText(l_confirmDelete)))
        {
            return false;
        }
        var moduleId = $(this).attr("crap-data");
        deleteModule(moduleId);
        getLocalModules();
        return false;// 不在传递至父容器
    });
    /*******上移**********/
    $("#modules").on("click",".up-module", function() {
        var moduleId = $(this).attr("crap-data");
        upModule(moduleId);
        getLocalModules();
        return false;// 不在传递至父容器
    });
    /*******下移**********/
    $("#modules").on("click",".down-module", function() {
        var moduleId = $(this).attr("crap-data");
        downModule(moduleId);
        getLocalModules();
        return false;// 不在传递至父容器
    });

    $("#modules").on("click",".rename-module", function() {
        var moduleId = $(this).attr("crap-data");
        $("#rename-module-id").val(moduleId);
        lookUp('dialog2', '', '', 400 ,7,'');
        $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
        showMessage('dialog2','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

	$("#open-debug").click(function(){
			window.open("debug.html")
	});
    $("#open-json").click(function(){
        window.open("json.html")
    });
    $("#set-web-site").click(function(){
        window.open("setting.html")
    });

    $(".submitSetting").click(function(event){
        var _this=$(event.target);
        var name = _this.attr('crap-data-name');
        setSetting(name,$("#" + name).val(), _this);
    });


	$(".params-headers-table").on("keyup","input", function() {
      if($(this).val() != ''){
          var tr = $(this).parent().parent();
          if( tr.hasClass("last") ){
              var table = tr.parent();
              table.append(paramsTr);
              tr.removeClass("last");
          }
      }
    });

	// 当前是否显示批量编辑
	var showBulkParams = false;
	var showBulkHeaders = false;
	
	// 批量编辑
	$(".bulk-edit").click(function(){
       var preId = $(this).attr("crap-data-value");
	   if( preId == "headers"){
		   showBulkHeaders = true;
	   }
	   if( preId == "params"){
			showBulkParams = true;
	   }
	   $("#"+preId+"-table").addClass("none");
	   $("#"+preId+"-bulk-edit-div").removeClass("none");
	    var bulkParams = "";
	    var texts = $("#"+preId+"-div input[type='text']");
		// 获取所有文本框
		var key = "";
		$.each(texts, function(i, val) {
			   try {
				   if(val.getAttribute("data-stage") == "value"){
					   var p = key+":" + val.value;
					   if( p != ":"){
						   bulkParams += p + "\n";
					   }	
				   }else if(val.getAttribute("data-stage") == "key"){
						key = val.value;
				   }
			   } catch (ex) { }
		});
		$("#"+preId+"-bulk").val(bulkParams);
    });
	
	// key-value编辑
	$(".key-value-edit").click(function(){
       var preId = $(this).attr("crap-data-value");
	   if( preId == "headers"){
		   showBulkHeaders = false;
	   }
	   if( preId == "params"){
			showBulkParams = false;
	   }
	   $("#"+preId+"-table").removeClass("none");
	   $("#"+preId+"-bulk-edit-div").addClass("none");
	    var bulkParams = $("#"+preId+"-bulk").val();
		var params = bulkParams.split("\n");
		$("#"+preId+"-table tbody").empty();
	    for(var i=0 ; i< params.length; i++){
			if( params[i].trim() != ""){
				var p = params[i].split(":");
				if(p.length>2){
                    for(var j=2 ; j< p.length; j++){
                        p[1] = p[1] +":" + p[j];
                    }
                }
				var key = p[0];
				var value = "";
				if(p.length >1 ){
					value = p[1];
				}
                var keyInput = document.createElement("input");
                keyInput.setAttribute("class","form-control") ;
                keyInput.setAttribute("data-stage","key") ;
                keyInput.setAttribute("type","text") ;
                keyInput.setAttribute("value",key) ;

                var valueInput = document.createElement("input");
                valueInput.setAttribute("class","form-control") ;
                valueInput.setAttribute("data-stage","value") ;
                valueInput.setAttribute("type","text") ;
                valueInput.setAttribute("value",decodeURIComponent(value)) ;

                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.appendChild(keyInput)
                var td2 = document.createElement("td");
                td2.appendChild(valueInput)
                tr.appendChild(td1);
                tr.appendChild(td2);

                $(tr).append("<td class='w20'><i class='iconfont cursor color-adorn'>&#xe69d;</i></td>");
                $("#"+preId+"-table tbody").append(tr)
			}
		}
		$("#"+preId+"-table tbody").append(paramsTr);
    });
	
	$("#format-row").click(function(){
	    var rowData = originalResponseText;
	    if( rowData == ""){
            originalResponseText = $("#response-row").val();
            rowData = originalResponseText;
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $("#response-row").val(rowData);
        responseShow("response-row");
        $('#response-row').removeAttr("readonly");
        originalResponseText = "";
    });

    $("#format-pretty").click(function(){
        var rowData = originalResponseText;
        if( rowData == ""){
            originalResponseText = $("#response-row").val();
            rowData = originalResponseText;
        }
        try{
            var jsonFormatResult = format(rowData);
            if (jsonFormatResult != null && jsonFormatResult != '') {
                $("#response-row").val(jsonFormatResult);
            }
        }catch(e){
            console.warn(e)
            $("#response-row").val(rowData);
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $('#response-row').attr("readonly","readonly");
        responseShow("response-row");
    });

    $('.response-json').on('click', function() {
       if( !formatJson() ){
            return;
       }
       changeBg("btn-default", "btn-main", "response-menu",this);
	   var value = $(this).attr("crap-data-value");
	   var key = $(this).attr("crap-data-name");
       $('#response-pretty').JSONView(key, value);
       responseShow("response-pretty");
    });

    $(".params-headers-table").on("click","i",function() {
        var tr = $(this).parent().parent();
        // 最后一行不允许删除
        if( tr.hasClass("last")){
            return;
        }
        tr.remove();
    });

    // 请求头、参数切换
  $(".params-title").click(function(){
        $(".params-title").removeClass("adorn-bb2");
        $(this).addClass("adorn-bb2");
        var contentDiv = $(this).attr("data-stage");
        $("#headers-div").addClass("none");
        $("#params-div").addClass("none");
        $("#"+contentDiv).removeClass("none");
  });

    $(".response-title").click(function(){
        $(".response-title").removeClass("bb2");

        $(this).addClass("bb2");
        var contentDiv = $(this).attr("data-stage");
        $(".response-header").addClass("none");
        $(".response-body").addClass("none");
        $(".response-cookie").addClass("none");
        $("."+contentDiv).removeClass("none");
    });

    $(".tabs").click(function(){
        $(".tabs").removeClass("adorn-bb2");
        $(this).addClass("adorn-bb2");
        
        $("#headers-div").addClass("none");
        $("#params-div").addClass("none");
        $(".response-header").addClass("none");
        $(".response-body").addClass("none");
        $(".response-cookie").addClass("none");

        var contentDiv = $(this).attr("data-stage");
        console.log(contentDiv);
        $("#"+contentDiv).removeClass("none");
  });



    $("#method").change(function() {
        if( $("#method").val() != "GET"){
            if($("#content-type").hasClass("none")){
                $("#content-type").removeClass("none");
            }
        }else{
            $("#param-type-value").prop("checked",true);
            $("input[name='param-type']").change();
            if(!$("#content-type").hasClass("none")){
                $("#content-type").addClass("none");
            }
        }
    });

    // param-type=customer
    $("#customer-type").change(function() {
        $("#customer-type-value").val( $("#customer-type").val() );
    });
    // 单选param-type监控
    $("input[name='param-type']").change(function(){
        var crapData = $("input[name='param-type']:checked").attr("crap-data");
        if( crapData && crapData=="customer") {
            $("#customer-type").removeClass("none")
            $("#params-table").addClass("none");
            $("#customer-div").removeClass("none");
        }else{
            $("#customer-type").addClass("none");
            $("#customer-div").addClass("none");
            $("#params-table").removeClass("none");
        }
    });

  // 插件调试send
  $("#send").click(function(){
	  if( showBulkHeaders ){
		 $("#headers-bulk-edit-div .key-value-edit").click();
	  }
	  if( showBulkParams ){
		 $("#params-bulk-edit-div .key-value-edit").click();
	  }
	  
	  if($("#sendType").val()=="1"){
		  callAjax();
	  }else{
		  send_callAjax();
	  }
	  
  });

    // 初始化提示
    $("#" + ID_NOTICE).click(function(){
        saveLocData(NOTICE_CLICK, "yes");
    });

    // 跳转
    $(".goHref").click(function(){
        var href = $(this).attr(ATTR_HREF);

        if (!href){
            return false;
        }

        if (href.indexOf('PLUG:') == 0){
            href = href.replace("PLUG:", "");
        }else if (href.indexOf('http') != 0){
            href = getWebSiteUrl() + "/" + href;
        }

        var hrefParamStr = $(this).attr(ATTR_HREF_PARAMS);
        if (hrefParamStr){
            var hrefParams = hrefParamStr.split("|");
            for(var i=0; i<hrefParams.length;i++) {
                href = href.replace('{{'+ i + "}}", hrefParams[i]);
            }
        }

        if ($(this).attr(ATTR_HREF_NEW_PAGE) == TRUE){
            window.open(href);
            return false;
        }

        setAttr(ID_IFRAME_DIALOG_IFRAME, "src", href);
        setHtml(ID_IFRAME_DIALOG_TITLE, getText($(this).attr(ATTR_HREF_TITLE)))
        lookUp('iframe-dialog', '', '', 1100 ,7,'');
        $("#iframe-dialog").css("height","640px");
        $(".look-up-content").css("height","600px");
        $("#iframe-dialog").css("top","60px");

        showMessage('iframe-dialog','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    // 登陆
    $("#login-button").click(function(){
        setAttr(ID_IFRAME_DIALOG_IFRAME, "src", getWebSiteUrl() + "/loginOrRegister.do#/login")
        setAttr(ID_IFRAME_DIALOG_CLOSE, ATTR_IFRAME_CLOSE, TRUE)
        setHtml(ID_IFRAME_DIALOG_TITLE, getText(l_loginTitle))
        lookUp('iframe-dialog', '', '', 1100 ,7,'');
        $("#iframe-dialog").css("height","640px");
        $(".look-up-content").css("height","600px");
        $("#iframe-dialog").css("top","60px");

        showMessage('iframe-dialog','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    $("#" + ID_IFRAME_DIALOG_CLOSE).click(function(){
        if (getAttr(ID_IFRAME_DIALOG_CLOSE, ATTR_IFRAME_CLOSE) == TRUE) {
            window.location.reload();
        }
        return false;
    });

    // div 拖动
    $("#left").resizable(
        {
            autoHide: true,
            handles: 'e',
            maxWidth: 700,
            minWidth: 180,
            /*
            resize: function(e, ui){
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();

                var divTwo = $("#right");
                var divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
            }*/
            resize:function(event,ui){ //
        		$('#right').width($('#content').width()-ui.size.width);
        	}
        	/*,
            stop: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();
                var divTwo = $("#right");
                var divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
                ui.element.css(
                    {
                        width: ui.element.width()/parentWidth*100+"%",
                    });
                localStorage[MENU_WIDTH] = ui.element.width()/parentWidth*100;
            }*/
        });
})
