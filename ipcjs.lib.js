; (function () {
    const log = console.log.bind(console)
    /**
     * 创建元素的快捷方法: 
     * 1. type, props, children
     * 2. type, props, innerHTML
     * 3. 'text', text
     * @param type string, 标签名; 特殊的, 若为text, 则表示创建文字, 对应的t为文字的内容
     * @param props object, 属性; 特殊的属性名有: className, 类名; style, 样式, 值为(样式名, 值)形式的object; event, 值为(事件名, 监听函数)形式的object;
     * @param children array, 子元素; 也可以直接是html文本;
     */
    const util_ui_element_creator = (type, props, children) => {
        let elem = null;
        if (type === "text") {
            return document.createTextNode(props);
        } else {
            elem = document.createElement(type);
        }
        for (let n in props) {
            if (n === "style") {
                for (let x in props.style) {
                    elem.style[x] = props.style[x];
                }
            } else if (n === "className") {
                elem.className = props[n];
            } else if (n === "event") {
                for (let x in props.event) {
                    elem.addEventListener(x, props.event[x]);
                }
            } else {
                elem.setAttribute(n, props[n]);
            }
        }
        if (children) {
            if (typeof children === 'string') {
                elem.innerHTML = children;
            } else {
                for (let i = 0; i < children.length; i++) {
                    if (children[i] != null)
                        elem.appendChild(children[i]);
                }
            }
        }
        return elem;
    }
    const util_html = function (html) {
        let template = util_ui_element_creator('template')
        template.innerHTML = html.trim()
        return Array.from(template.content.childNodes)
    }
    if (window.ipcjs) {
        log('已经存在window.ipcjs', window.ipcjs)
    } else {
        window.ipcjs = {
            _: util_ui_element_creator,
            html: util_html,
            log: log,
            installInto: function (target) {
                if (typeof target === 'function') {
                    target.call(null, this)
                } else {
                    Object.assign(target, this)
                }
            }
        }
    }
})()
