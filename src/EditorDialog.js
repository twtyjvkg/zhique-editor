export default function getLinkDialog() {

    return '<div class="editor-dialog">' +
        '<div class="link-dialog-header">' +
        '<strong class="link-dialog-title">添加链接</strong> ' +
        '</div>' +
        '<div class="editor-dialog-container">' +
        '<div class="editor-dialog-form">' +
        '<label>链接地址</label><input type="text" /><br />' +
        '<label>链接标题</label><input type="text" /><br />' +
        '</div>' +
        '<div class="editor-dialog-footer">' +
        '<button>确定</button>' +
        '<button>取消</button>' +
        '</div>' +
        '</div>' +
        '</div>';
}