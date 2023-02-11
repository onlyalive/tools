/***********id********/
var ID_USER_NAME = "id-user-name";
var ID_LOGIN = "login-button";
var ID_LOGOUT = "id-logout";
var ID_NOTICE = "id-notice";
var ID_WEB_EDIT_INTERFACE = "id-web-edit-interface";
var ID_WEB_VIEW_INTERFACE = "id-web-view-interface";
var ID_IFRAME_DIALOG_TITLE = "id-iframe-dialog-title"
var ID_IFRAME_DIALOG_IFRAME = "iframe-dialog-iframe";
var ID_IFRAME_DIALOG_CLOSE = "iframe-dialog-close";
var ID_CURRENT_PROJECT_NAME = "id-current-project-name";
var ID_CURRENT_PROJECT_COVER = "id-current-project-cover";
var ID_PROJECT_LIST_CONTENT = "id-project-list-content";
var ID_CHANGE_PROJECT = "id-change-project";
var ID_MAX_PROJECT_TIP = "id-max-project-tip";
var ID_CONTRACT = "id-contract";
var TRUE = "true";
var EMPTY_ARRAY = "[]";
// 数字版本，和插件版本保持一致，一位对两位： 1.1.4
var PLUG_VERSION = 10104;

// 本地数据
var USER_LOGIN_INFO = "crap-data-user-info";

var CURRENT_PROJECT_UNIKEY = "crap-data-current-project-unikey";
var CURRENT_PROJECT_NAME = "crap-data-current-project-name";
var CURRENT_PROJECT_COVER = "crap-data-current-project-cover";

var CRAP_DEBUG_MODULES = "crap-debug-modules";
var INIT_URL = "/admin/init.do";
var LOGOUT_URL = "/user/loginOut.do";

var LANG_ZH_CN = "zh-CN";

var WEB_SITE_URL = "crap-web-site-url";
var WEB_HTTP_TIMEOUT = "crap-http-timeout";
var SETTING_LANGUAGE = "crap-setting-language";
var NOTICE_CLICK = "crap-notice-click";
var MENU_WIDTH = "crap-menu-width";

var ATTR_HREF = "crap-href"
var ATTR_HREF_PARAMS = "crap-href-params"
var ATTR_HREF_TITLE = "crap-href-title"
var ATTR_IFRAME_CLOSE = "crap-iframe-close"
var ATTR_HREF_NEW_PAGE = "crap-href-new-page"

/***********js 提示，必须以l_开头：表示language **********/
var _en = "_en"
var l_responseNotJsonTip = "l_responseNotJsonTip";
var l_logoutSuccessTip = "l_logoutSuccessTip";
var l_loginTitle = "l_loginTitle";
var l_editInterfaceTitle = "l_editInterfaceTitle";
var l_successTip = "l_successTip"
var l_clearLocalData = "l_clearLocalData";
var l_clearSuccessLogoutFail = "l_clearSuccessLogoutFail";
var l_clearSuccessLogoutSuccess = "l_clearSuccessLogoutSuccess";
var l_moduleNameIsNullTip = "l_moduleNameIsNullTip";
var l_confirmDelete = "l_confirmDelete";
var l_formatErrorTip = "l_formatErrorTip";
var l_timeoutFormatErrorTip = "l_timeoutFormatErrorTip";
var l_menuWidthErrorTip = "l_menuWidthErrorTip";
var l_languageChangeTip = "l_languageChangeTip";
var l_updateSuccessTip = "l_updateSuccessTip";
var l_netErrorTip = "l_netErrorTip";
var l_unknownErrorTip = "l_unknownErrorTip";
var l_clickSendTip = "l_clickSendTip";
var l_urlIsNullTip = "l_urlIsNullTip";
var l_connectingError = "l_connectingError";
var l_interfaceNameIsNullTip = "l_interfaceNameIsNullTip";
var l_selectModuleTip = "l_selectModuleTip";
var l_saveInterface = "l_saveInterface";
var l_edit = "l_edit";
var l_closeAlertTip = "l_closeAlertTip";
var l_varSaveSuccess = "l_varSaveSuccess";
var l_save = "l_save";
var l_manageEnvVariable = "l_manageEnvVariable";
var l_envVariable = "l_envVariable";
var l_jsonToolErrorTip = "l_jsonToolErrorTip";
var l_defDebugName = "l_defDebugName";
var l_changeProject = "l_changeProject";
var l_netError = "l_netError";
var l_notLogin = "l_notLogin";
var l_vipTip = "l_vipTip";
var l_notVipTip = "l_notVipTip";
var l_noEnvVariable = "l_noEnvVariable";

var textObj = {
    "l_logoutSuccessTip": "退出登陆成功!",
    "l_successTip": "成功 !",
    "l_clearLocalData": "确定要删除本地数据吗?",
    "l_clearSuccessLogoutFail": "清除数据本地数据成功，但退出登陆失败!",
    "l_clearSuccessLogoutSuccess": "清除数据本地数据成功，退出成功!",
    "l_moduleNameIsNullTip": "模块名不能为空!",
    "l_confirmDelete": "确定删除？",
    "l_formatErrorTip": "格式化异常，请检查json格式是否有误：",
    "l_timeoutFormatErrorTip": "异常! 超时时间必须是数字，且必须大于1000!",
    "l_languageChangeTip": "修改成功，刷新页面后生效!",
    "l_menuWidthErrorTip": "菜单宽度必须大于15，小于50",
    "l_updateSuccessTip": "修改成功!",
    "l_netErrorTip": "网络异常",
    "l_unknownErrorTip": "未知异常",
    "l_clickSendTip": "请点击【发送】按钮获取返回数据",
    "l_responseNotJsonTip": "返回数据不是Json格式",
    "l_urlIsNullTip": "接口Url不能为空！",
    "l_interfaceNameIsNullTip": "接口名不能为空！",
    "l_connectingError": "连接网络时发生异常： ",
    "l_selectModuleTip": "点击选择模块",
    "l_saveInterface": "保存接口:",
    "l_edit": "编辑",
    "l_closeAlertTip": "请勿禁用【确认】弹窗，直接操作非常危险!",
    "l_varSaveSuccess": "环境变量保存成功!",
    "l_save": "提交保存",
    "l_manageEnvVariable": "管理环境变量",
    "l_noEnvVariable": "暂无环境变量",
    "l_envVariable": "未选择环境",
    "l_jsonToolErrorTip": "第LINE_NUM行，第POSITION_NUM个字符异常",
    "l_loginTitle": "登陆",
    "l_editInterfaceTitle": "编辑接口",
    "l_defDebugName": "默认调试项目",
    "l_changeProject": "切换项目",
    "l_netError": "网路异常，请检查网络后再试",
    "l_notLogin": "抱歉，未登录",
    "l_vipTip": "你是VIP用户，最多支持VIP_NUM个项目",
    "l_notVipTip": "非VIP用户最多支持MAX_NUM个项目，可联系客服88元开通一年VIP（买一年赠一年），VIP用户最多支持50个项目 ",
}