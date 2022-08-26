var checkHandler = {
    items: {},
    addItem: function (k, v) {
        this.items[k] = v;
    },
    deleteItem: function (k) {
        delete this.items[k];
    },
    checkSelf: function (target) {
        var $target = $(target);
        if ($target.prop('required')) {
            var val = $target.val();
            var type = $target.attr("type");
            var name = $target.attr("name");
            var hasV;
            if (type === 'radio' || type === 'checkbox') {
                hasV = $("input[name='" + name + "']:checked").size() > 0;
            } else {
                hasV = val.length > 0;
            }
            if (hasV) {
                this.deleteItem(name);
            } else {
                this.addItem(name, {type: type, promptTips: $target.attr("promptTips")});
            }
        }
    },
    checkItems: function () {
        var items = this.items,
            flag = true;
        for (var k in items) {
            if (items.hasOwnProperty(k)) {
                alert(items[k].promptTips);
                var ind = '';
                if (items[k].type === "radio" || items[k].type === "checkbox") {
                    ind = '0';
                }
                var item = $("#" + k + ind);
                var content = item.closest("div.tab_content");
                var base = content.closest("div.abase_tab");
                var divId = content.attr("id");
                var li = base.find("a[href='#" + divId + "']").parent("li");
                li.click();
                item.focus();
                flag = false;
                break;
            }
        }
        return flag;
    }
};
/*分数处理函数*/
var scoreHandler = {
    items: {},
    change: function (target) {
        var $target = $(target);
        var score = $target.attr("score");
        if (/^(-)?\d+$/g.test(score)) {
            var scoreType = $target.attr("scoreType");
            var totalScore = this.items[scoreType] || 0,
                oldScore;
            if ($target.attr("type") === "radio") {
                var prevC = $("input[name='" + $target.attr("name") + "'][prevChecked=true]");
                oldScore = prevC.attr("score");
                prevC.removeAttr("prevChecked");
                $target.attr("prevChecked", $target.prop("checked"));
            }
            totalScore += score * ($target.prop("checked") ? 1 : -1) - (oldScore || 0);
            this.items[scoreType] = totalScore;
            $("#" + scoreType + "Score").val(totalScore);
        }
    }
};

function doCancel(parentId,target) {
    (target==="_parent"?parent:window).location.href = 'start' + (parentId ? ('?parentId=' + encodeURI(parentId)) : '');
}

/**提交数據**/
function addData() {
    var btnAdds = $("input[name='btnAdd']").slice();
    btnAdds.attr("disabled", true);
    if (checkHandler.checkItems()) {
        return true;
    } else {
        btnAdds.attr("disabled", false);
        return false;
    }
}

/*显示其他控件*/
function showOther(target) {
    var $target = $(target);
    var other = $("#" + $target.attr("name") + "Other" + $target.attr("index"));
    if ($target.prop("checked")) {
        if ($target.attr("type") === "radio") {
            var others = $("input[name^='" + $target.attr("name") + "Other" + "']:not(:disabled)").slice();
            others.prop("disabled", true);
            others.val("");
        }
        other.prop("disabled", false);
        other.focus();
        other.val("");
    } else {
        other.prop("disabled", true);
        other.val("");
    }
}

/*获取日期控件*/
function getDate(target) {
    var value = target.value;
    var date = window.showModalDialog(globalDataPath,
        "",
        "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:15");
    if ((date === "undefined") || (date == null)) {
        if (value == null)
            return "";
        else
            return value;
    } else
        target.value = date;
    return date;
}

/*隐藏select option*/
function hideOption(target,parent) {
    var superId = parent.val();
    target.find("option:not([super='" + superId + "'])").slice(1).wrap("<span style='display:none'></span>");
}

/*显示select option*/
function showChildren(origin, target) {
    var originS = $(origin);
    var targetS = $(target);
    targetS.find("option").each(function (i) {
        if (i > 0) {
            var $this = $(this);
            var spans = $this.parent("span");
            if (spans.size()) {
                if (originS.val() === $this.attr("super")) {
                    $this.unwrap();
                }
            } else if (originS.val() !== $this.attr("super")) {
                $this.wrap("<span style='display:none'></span>");
            }
        }
    });
    targetS.change();
}

function checkExists(target) {
    var $target = $(target);
    var key = $target.attr("name");
    var value = $target.val();
    if (value && value !== $target.attr("prevV")) {
        $target.attr("prevV", value);
        $.ajax({
            url: 'checkExists',
            data: {key: key, value: value},
            cache: false,
            async: false,
            type: "POST",
            dataType: "text",
            success: function (data) {
                if ("true" === $.trim(data)) {
                    alert("该"+$target.attr("title")+"已存在，请重新填写！");
                    $target.val("");
                    $target.focus();
                }
            },
            error: function () {
                alert("设定发生错误");
            }
        });
    }
}

/*页签初始化*/
$(function () {
    // 預設顯示第一個 Tab
    var _showTab = 0;
    $('.abase_tab').each(function () {
        // 目前的頁籤區塊
        var $tab = $(this);

        $('ul.tabs li', $tab).eq(_showTab).addClass('active');
        $('.tab_content', $tab).hide().eq(_showTab).show();

        // 當 li 頁籤被點擊时...
        // 若要改成滑鼠移到 li 頁籤就切換时, 把 click 改成 mouseover
        $('ul.tabs li', $tab).on('click', function () {
            // 找出 li 中的超連结 href(#id)
            var $this = $(this),
                _clickTab = $this.find('a').attr('href');
            // 把目前點擊到的 li 頁籤加上 .active
            // 並把兄弟元素中有 .active 的都移除 class
            $this.addClass('active').siblings('.active').removeClass('active');
            // 淡入相对應的內容並隱藏兄弟元素
            $(_clickTab).stop(false, true).fadeIn().siblings('.tab_content').hide();

        }).on('focus', 'a', function () {
            this.blur();
        });
    });
});
