let oldFile = '';
window.onload = function () {
    var input = document.getElementById("demo_input");
    var result = document.getElementById("result");
    var img_area = document.getElementById("img_area");
    if (typeof (FileReader) === 'undefined') {
        $("#result").html("抱歉，你的浏览器不支持 FileReader，请使用最新的主流浏览器操作！");
        input.setAttribute('disabled', 'disabled');
    } else {
        input.addEventListener('change', readFile, false);
    }
}
function readFile() {
    var file = this.files ? this.files[0] : oldFile;
    oldFile = file;
    if(!file) return;
    if (!/image\/\w+/.test(file.type)) {
        result.setAttribute("color", "red")
        $("#result").html("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        $("#result").val(this.result);
        $("#img_area").html('<img src="' + this.result + '" alt="图片Base64编码" />');
    }
}
function imgfun() {
    var result = $("#result").val();
    if (result.indexOf("<img") < 0) {
        $("#result").val('<img src="' + result + '" alt="图片Base64编码"/>');
        $("#img_area").html('' + $("#result").val() + '');
    }
}
function empty() {
    $("#img_area").html("");
    $("#result").val("");
    $("#result").select();
}

async function copyHandler() {
    const text = $('#result').val();
    try {
        if (navigator.clipboard && window.isSecureContext) {
            const clipboardObj = navigator.clipboard;
            await clipboardObj.writeText(text);
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = text;
            // 使text area不在viewport，同时设置不可见
            textArea.style.position = "absolute";
            textArea.style.opacity = 0;
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            await new Promise((res, rej) => {
                // 执行复制命令并移除文本框
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
        alert('复制成功！')
    } catch (err) {
        alert('复制失败！')
    }
}