/**
 * env.js
 */
var ID_DIALOG_ADD_ENV = "id-dialog-add-env";
var ID_ENV_NAME = "id-env-name";
var ID_ENV_ID = "id-env-id";
var ID_ENV_LIST = "id-env-list";
var CRAP_DATA_ENV_ID = "crap-data-env-id";
var CRAP_DATA_ENV_NAME = "crap-data-env-name";
var ID_ENV_VARIABLE_TABLE = "env-variable-table";
var ENV_LIST_MENU = "env-list-menu";
var ID_EDIT_ENG_ID = "id-edit-env-id";
var ID_INTERFACE_ENV_LIST = "id-interface-env-list";
var ID_CURRENT_ENV_NAME = "id-current-env-name";

var ENV_DIV = "<div class='env-list-menu' crap-data-env-id='ca_envId'> ca_envName ";
ENV_DIV += "<div class='delete-env' crap-data-env-id='ca_envId'><i class='iconfont'>&#xe69d;</i></div>";
ENV_DIV += "<div class='edit-env' crap-data-env-id='ca_envId' crap-data-env-name='ca_envName'><i class='iconfont'>&#xe69e;</i></div>";
ENV_DIV += "</div>";

var INTERFACE_ENV_DIV = "<li><a class='pl10 pr10 cursor pt5 pb5' crap-data-env-id='ca_envId' crap-data-env-name='ca_envName'>ca_envName</a></li>"

var INTERFACE_ENV_MANAGER = "<li role='separator' class='divider pl10 pr10'></li> <li>";
INTERFACE_ENV_MANAGER += "<a href='env.html' target='_blank' class='pl10 pr10'> ";
INTERFACE_ENV_MANAGER +="<i class='iconfont color-adorn mt-3 pr5 f14'>&#xe604;</i>";
INTERFACE_ENV_MANAGER +="<span>" + getText(l_manageEnvVariable) + "</span></a></li>";


$(function(){
    drawEnvList();
    // 添加环境
    $("#id-add-env").click(function(){
        lookUp(ID_DIALOG_ADD_ENV, '', '', 600 ,7,'');
        $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
        showMessage(ID_DIALOG_ADD_ENV,'false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    $("#id-env-list").on("click",".edit-env",function() {
        lookUp(ID_DIALOG_ADD_ENV, '', '', 600 ,7,'');
        $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
        setValue(ID_ENV_ID, $(this).attr(CRAP_DATA_ENV_ID));
        setValue(ID_ENV_NAME, $(this).attr(CRAP_DATA_ENV_NAME));
        showMessage(ID_DIALOG_ADD_ENV,'false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    $("#id-env-list").on("click",".delete-env",function() {
        if(!myConfirm(getText(l_confirmDelete)))
        {
            return false;
        }
        deleteEnv($(this).attr(CRAP_DATA_ENV_ID));
        drawEnvList();
        drawEnvVariable();
        return false;
    });

    $("#id-save-env").click(function(){
        saveUpdateEnv(getValue(ID_ENV_ID), getValue(ID_ENV_NAME));
        drawEnvList();
        closeMyDialog(ID_DIALOG_ADD_ENV);
    });

    $("#id-env-list").on("click","." + ENV_LIST_MENU,function() {
        drawEnvVariable($(this).attr(CRAP_DATA_ENV_ID))
        $("." + ENV_LIST_MENU).removeClass("btn-main");
        $(this).addClass("btn-main");
        $("#id-save-env-var").removeClass("none");
        $("#id-save-env-var").addClass("btn-adorn");
        $("#id-save-env-var").removeClass("btn-main");
        $("#id-save-env-var").html(getText(l_save));
    });


    // 变量
    $("#" + ID_ENV_VARIABLE_TABLE).on("keyup","input", function() {
        if($(this).val() != ''){
            var tr = $(this).parent().parent();
            if( tr.hasClass("last") ){
                var table = tr.parent();
                table.append(paramsTr);
                tr.removeClass("last");
            }
        }
    });
    $("#" + ID_ENV_VARIABLE_TABLE).on("click","i",function() {
        var tr = $(this).parent().parent();
        // 最后一行不允许删除
        if( tr.hasClass("last")){
            return;
        }
        tr.remove();
    });

    $("#" + ID_INTERFACE_ENV_LIST).on("click","a",function() {
        if ($(this).attr(CRAP_DATA_ENV_ID) && $(this).attr(CRAP_DATA_ENV_NAME)){
            saveLocData(DEF_ENV_ID,  $(this).attr(CRAP_DATA_ENV_ID));
            saveLocData(DEF_ENV_NAME, $(this).attr(CRAP_DATA_ENV_NAME));
            drawCurrentEnv();
        }
    });

    $("#id-env-group").click(function(){
        drawInterfaceEnvList();
    });

    $("#id-save-env-var").click(function() {
        var texts = $("#" + ID_ENV_VARIABLE_TABLE + " input[type='text']");
        var key = "";
        var varList = $.parseJSON("[]");
        $.each(texts, function(i, val) {
            try {
                if(val.getAttribute("data-stage") == "value"){
                    var value = val.value;
                    if(handerStr(value) != ""){
                        var variable = {
                            "key": key,
                            "value": value
                        };
                        varList.unshift(variable)
                    }
                } else if(val.getAttribute("data-stage") == "key"){
                    key = val.value;
                }
            } catch (ex) { }
        });

        saveAllVar(getValue(ID_EDIT_ENG_ID), varList)
        $(this).html(getText(l_varSaveSuccess));
        $("#id-save-env-var").addClass("btn-main");
        $("#id-save-env-var").removeClass("btn-adorn");
    });

})

function drawInterfaceEnvList() {
    var enviroList = getAllEnv();
    $("#" + ID_INTERFACE_ENV_LIST).html("");
    for(var i=0 ; i<enviroList.length; i++) {
        var name = enviroList[i].name;
        var id = enviroList[i].id;
        $("#" + ID_INTERFACE_ENV_LIST).append(INTERFACE_ENV_DIV.replace(/ca_envId/g, id).replace(/ca_envName/g, name));
    }

    if (enviroList.length == 0){
        $("#" + ID_INTERFACE_ENV_LIST).append(INTERFACE_ENV_DIV.replace(/ca_envId/g, "noEnvVariable").replace(/ca_envName/g, getText(l_noEnvVariable)));
    }

    $("#" + ID_INTERFACE_ENV_LIST).append(INTERFACE_ENV_MANAGER);

}

function drawEnvList() {
    var enList = getAllEnv();
    var envText = "";
    for(var i=0 ; i<enList.length; i++) {
        if (enList[i].status == -1) {
            continue;
        }
        var name = enList[i].name;
        var id = enList[i].id;
        envText += ENV_DIV.replace(/ca_envId/g, id).replace(/ca_envName/g, name);
    }
    setHtml(ID_ENV_LIST, envText);
}

function drawEnvVariable(envId) {
    setValue(ID_EDIT_ENG_ID, envId)
    $("#" + ID_ENV_VARIABLE_TABLE + " tbody").html("");
    var varList = getAllVar(envId);
    for(var i=0 ; i< varList.length; i++){
        var variable = varList[i];
        var key = variable.key;
        var value = variable.value;

        var tdText = paramsTr.replace("'key'","'key' value='"+key+"'").replace("'value'","'value' value='"+value+"'");
        tdText = tdText.replace("last","");

        $("#" + ID_ENV_VARIABLE_TABLE + " tbody").append(tdText);
    }
    $("#" + ID_ENV_VARIABLE_TABLE + " tbody").append(paramsTr);
}

function getCurrentEnvId() {
   return getLocData(DEF_ENV_ID);
}

function drawCurrentEnv() {
    setHtml(ID_CURRENT_ENV_NAME, getLocDataDef(DEF_ENV_NAME, getText(l_envVariable)));
}

function drawNotice() {
    if (getLocData(NOTICE_CLICK) == ""){
        $("#" + ID_NOTICE).removeClass("ndis");
    }
}


function drawEnvVariable(envId) {
    if(envId == null){
        setValue(ID_EDIT_ENG_ID, null);
        $("#" + ID_ENV_VARIABLE_TABLE + " tbody").html("");
        $("#id-save-env-var").addClass("none");
        return;
    }

    setValue(ID_EDIT_ENG_ID, envId)
    $("#" + ID_ENV_VARIABLE_TABLE + " tbody").html("");
    var varList = getAllVar(envId);
    for(var i=0 ; i< varList.length; i++){
        var variable = varList[i];
        var key = variable.key;
        var value = variable.value;

        var tdText = paramsTr.replace("'key'","'key' value='"+key+"'").replace("'value'","'value' value='"+value+"'");
        tdText = tdText.replace("last","");

        $("#" + ID_ENV_VARIABLE_TABLE + " tbody").append(tdText);
    }
    $("#" + ID_ENV_VARIABLE_TABLE + " tbody").append(paramsTr);
}

/**
 * env-dao.js
 */
var ENV_LOC_KEY = "crap-env-list";
var VAR_LOC_KEY = "crap-var-list-";
var DEF_ENV_ID = "crap-env-def-id";
var DEF_ENV_NAME = "crap-env-def-name";

function saveAllEnv(list){
    localStorage[ENV_LOC_KEY] = JSON.stringify(list);
}

function saveAllVar(envId, varList){
    localStorage[VAR_LOC_KEY + envId] = JSON.stringify(varList);
}
function deleteVar(envId) {
    localStorage.removeItem(VAR_LOC_KEY + envId);
}

function getAllEnv(){
    try {
        var lovEnvList = localStorage[ENV_LOC_KEY];
        if (lovEnvList == null){
            lovEnvList = "[]";
        }
        return $.parseJSON(lovEnvList);
    } catch (e) {
        console.warn(e);
        return $.parseJSON("[]");
    }
}

function getAllVar(envId){
    if (handerStr(envId) == ""){
        return $.parseJSON("[]");
    }
    try {
        var lovVarList = localStorage[VAR_LOC_KEY + envId];
        if (lovVarList == null){
            lovVarList = "[]";
        }
        return $.parseJSON(lovVarList);
    } catch (e) {
        console.warn(e);
        return $.parseJSON("[]");
    }
}

function deleteEnv(id) {
    var envirList = getAllEnv();
    // 如果已经存在则删除
    var env;
    for (var i = 0; i < envirList.length; i++) {
        if (envirList[i].id == id) {
            env = envirList[i];
            env.status=-1;
            envirList.splice(i, 1);
            break;
        }
    }
    //envirList.unshift(env);
    deleteVar(id);
    saveAllEnv(envirList);
}

// 保存 or 更新
function saveUpdateEnv(id, name) {
    var enviList = getAllEnv();
    if( handerStr(id) == ""){
        id = new Date().getTime() + "-" + random(10);
    }

    var h = {
        "id": id,
        "name": name,
        "version":0,
        "status":1
    };

    // 如果已经存在则删除
    for (var i = 0; i < enviList.length; i++) {
        if (enviList[i].id == h.id) {
            h.status = enviList[i].status;
            h.version = enviList[i].version + 1;
            enviList.splice(i, 1);
            break;
        }
    }
    enviList.unshift(h);
    saveAllEnv(enviList)
    //refreshSyncIco(0);
}