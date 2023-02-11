function drawCurrentProject() {
    setHtml(ID_CURRENT_PROJECT_NAME, getLocDataDef(CURRENT_PROJECT_NAME, getText(l_defDebugName)));
    setAttr(ID_CURRENT_PROJECT_COVER, "src", getLocDataDef(CURRENT_PROJECT_COVER, "source/image/defCover.jpg"));
}

// 查询当前项目
function getCurrentProjectUniKey() {
    return getLocData(CURRENT_PROJECT_UNIKEY);
}

function setCurrentProjectUniKey(unikey, projectName, projectCover) {
    saveLocData(CURRENT_PROJECT_UNIKEY, unikey);
    saveLocData(CURRENT_PROJECT_NAME, projectName);
    if (projectCover && projectCover.indexOf("http") != 0){
        projectCover = getWebSiteUrl() + "/" + projectCover;
    }
    saveLocData(CURRENT_PROJECT_COVER, projectCover);
}

function getLocJsonData(key, def) {
    try {
        return $.parseJSON(getLocDataDef(key, def));
    } catch (e){
        console.warn(e);
        return $.parseJSON(def);
    }
}
/***********获取本地存储的数据**********/
function getLocData(key){
    try{
        var value = localStorage[key];
        if(value){
            return value;
        }
    }catch(e){
        console.warn(e);
        return "";
    }
    return "";
}

function getLocDataDef(key, def){
    try{
        var value = localStorage[key];
        if(value){
            return value;
        }
    } catch(e){
        console.warn(e);
        return def;
    }
    return def;
}
/*********存储数据至本地***********/
function saveLocData(key, value){
    try{
        localStorage[key] = value;
        return true;
    }catch(e){
        console.warn(e);
        return false;
    }
}

/**********登陆****************/
function getLoginInfoDAO(callBack) {
    httpPost(INIT_URL, true, callBack);
}
function drawLoginInfoDAO(response) {
    if (response.success == 1){
        setHtml(ID_USER_NAME, "Hi, " + response.data.sessionAdminName + " !");
        showDiv(ID_USER_NAME);
        hiddenDiv(ID_LOGIN);
        showDiv(ID_LOGOUT);
        saveLocData(USER_LOGIN_INFO ,JSON.stringify(response.data));
    }
}
$("#" + ID_LOGOUT).click(function(){
    httpPost(LOGOUT_URL, true, drawLogoutDAO);
});

function drawLogoutDAO(response) {
    alert(getText(l_logoutSuccessTip),3,"success");
    if (response.success == 1){
        hiddenDiv(ID_USER_NAME);
        showDiv(ID_LOGIN);
        hiddenDiv(ID_LOGOUT);
    }
}

/**********系统设置**************/
function getMenuWidth(){
    try {
        var menuWidth = localStorage[MENU_WIDTH];
        menuWidth = parseFloat(menuWidth);
        if (menuWidth && menuWidth != null && menuWidth.toString() != "NaN" && menuWidth > 15 && menuWidth < 50) {
            return menuWidth;
        } else {
            return 15;
        }
    }catch(e){
        return 15;
    }
}

function getHttpTimeout(){
    try {
        var httpTimeout = localStorage[WEB_HTTP_TIMEOUT];
        httpTimeout = parseFloat(httpTimeout);
        if (httpTimeout && httpTimeout != null && httpTimeout.toString() != "NaN" && httpTimeout > 1000) {
            return httpTimeout;
        } else {
            return 10000;
        }
    }catch(e){
        return 10000;
    }
}
function getWebSiteUrl(){
    var webSiteUrl = localStorage[WEB_SITE_URL];
    if (webSiteUrl && webSiteUrl != null && webSiteUrl != ''){
        return webSiteUrl;
    }else{
        return "http://api.crap.cn";
    }
}

function getLanguage(){
    return LANG_ZH_CN;
}

function getText(name) {
    return textObj[name];
}
