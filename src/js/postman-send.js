
function getSendHeaders() {
    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    var headers = {};
    $.each(texts, function (i, val) {
        try {
            if (val.getAttribute("data-stage") == "value") {
                var value = val.value;
                var varList = getAllVar(getCurrentEnvId())
                for (var i = 0; i < varList.length; i++) {
                    var variable = varList[i];
                    value = value.replace(new RegExp("\\{\\{" + variable.key + "\\}\\}", "g"), variable.value);
                    value = value.replace(new RegExp("%7B%7B" + variable.key + "%7D%7D", "g"), variable.value);
                    key = key.replace(new RegExp("\\{\\{" + variable.key + "\\}\\}", "g"), variable.value);
                    key = key.replace(new RegExp("%7B%7B" + variable.key + "%7D%7D", "g"), variable.value);
                }
                headers[key] = value;
            } else if (val.getAttribute("data-stage") == "key") {
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
    return headers;
}

function getSendParams() {
    var texts = $("#params-div input[type='text']");
    // 获取所有文本框
    var key = "";
    var params = {};
    $.each(texts, function (i, val) {
        try {
            if (val.getAttribute("data-stage") == "value") {
                if (key != "") {
                    //data += "&" + key + "=" + encodeURIComponent(val.value);
                    params[key] = val.value;
                }
            } else if (val.getAttribute("data-stage") == "key") {
                key = val.value;
            }
        } catch (ex) {
            console.warn(e);
            alert(ex);
        }
    });
    return params;
}



function send_callAjax() {
    var originUrl = $("#url").val().trim();
    if (originUrl == '') {
        $("#response-row").val(getText(l_urlIsNullTip));
        $("#format-row").click();
        return;
    }
    $("#float").fadeIn(300);

    var httpTimeout = getHttpTimeout();
    var timingTime = httpTimeout;

    // 倒计时提示
    setHtml("id-timing", (httpTimeout / 1000) + ' s');
    var setTime = setInterval(function () {
        timingTime = timingTime - 1000;
        if (timingTime <= 0 && timingTime <= 0) {
            setHtml("id-timing", "")
            clearInterval(setTime);  //清除定时器
        }
        setHtml("id-timing", (timingTime / 1000) + ' s')
    }, 1000);




    var headers = getSendHeaders();
    var formData = getSendParams();
    var HttpRequestModel = {};

    let HttpMethod = $("#method").val();
    let httpHost = $("#url").val();
    let rawType = $("#customer-type").val();
    let rawValue = $("#customer-value").val();

    HttpRequestModel.type = HttpMethod;
    HttpRequestModel.url = httpHost;
    HttpRequestModel.rawType = rawType;
    HttpRequestModel.rawValue = rawValue;
    //HttpRequestModel.params = params;
    HttpRequestModel.headers = headers;
    HttpRequestModel.formData = formData;


    //console.log("request:"+JSON.stringify(HttpRequestModel));



    //alert(JSON.parse(HttpRequestModel));
    $.ajax({
        url: "/send",
        type: 'POST',
        data: JSON.stringify(HttpRequestModel),
        contentType: "application/json",
        //timeout: httpTimeout,
        beforeSend: function (request) {
            //beforeSendHandleHeaders(request);
            $("#response-row").val("");
            $(".response-header .headers").html("");
            $(".response-header .general").html("");
            $("#response-pretty").html("");
            $(".response-cookie .table").append("");
            $("#format-row").click();
        },
        complete: function (responseData, textStatus) {
            if (textStatus == "success" || (textStatus == "error" && responseData.responseText != "")) {
                try {
                    //console.log("response:"+responseData.responseText);

                    var response = eval('(' + responseData.responseText + ')');


                    originalResponseText = response.obj.content;


                    eval('(' + originalResponseText + ')');

                    var data = responseData.responseText;
                    $("#response-row").val(data);
                    var head = responseData.getAllResponseHeaders().toString().huanhang();
                    $(".response-header .headers").html(head);
                    var general = "Request URL: " + url + "<br>Request Method: " + method + "<br>Status Code: " + responseData.status;
                    $(".response-header .general").html(general);
                    $("#response-pretty").html("");

                    var rootDomainStr = getRootDomain(url);
                    chrome.cookies.getAll({ domain: rootDomainStr }, function (cookies) {
                        $(".response-cookie .table tr").empty();
                        $(".response-cookie .table").append("<tr class='fb'><td>Name</td> <td>Value</td> <td>Path</td><td>Domain</td><td>ExpirationDate</td></tr>");
                        var a = document.createElement('a');
                        a.href = url;
                        for (i = 0; i < cookies.length; i++) {
                            if (("." + a.host).endWith(cookies[i].domain)) {
                                var cookieStr = "<tr>";
                                cookieStr += "<td class='w-p-10 break-word'>" + cookies[i].name + "</td>";
                                cookieStr += "<td class='w-p-30 break-word'>" + cookies[i].value + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].path + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].domain + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].expirationDate + "</td>";
                                cookieStr += "</tr>";
                                $(".response-cookie .table").append(cookieStr)
                            }
                        }
                    });
                } catch (e) {
                    $("#format-row").click();
                }

                try {
                    $.parseJSON(data);
                    $("#json-expand").click();
                } catch (e) {
                    $("#format-row").click();
                }
            } else {
                $("#response-row").val("textStatus: " + JSON.stringify(responseData) + "  " + textStatus + "\n\n" + getText(l_connectingError) + url);
                $("#format-row").click();
            }

            clearInterval(setTime);  //清除定时器
            setHtml("id-timing", "");
            $("#float").fadeOut(300);
        }
    });
}

$("#format-send-pretty").click(function () {
    var jsonString = $("#customer-value").val();
    var jsonObj = JSON.parse(jsonString)   //把json字符串转为json对象
    $('#customer-value').val(JSON.stringify(jsonObj, null, '  '));
})
