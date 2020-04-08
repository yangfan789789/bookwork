/*global $:true*/
var $menubar = (function () {
    var $bar = $('<div class="menubar"></div>');

    var menuData;
    var menus = [];

    var active = -1;

    function createMenuTitle() {
        var $titles = $('<ul class="menu-title"></ul>');

        for (var i = 0; i < menuData.length; i++) {
            var $title = $('<li class="title"></li>');

            $title.html(menuData[i].title);
            $title.attr('data-id', i);
            $titles.append($title);

            $title.click(function () {
                var i = Number(this.dataset.id);

                if (active === -1) {
                    menus[i].css({ display: 'inline-block' });
                    active = i;
                } else if (active !== i) {
                    menus[active].css({ display: 'none' });
                    menus[i].css({ display: 'inline-block' });
                    active = i;
                } else {
                    menus[active].css({ display: 'none' });
                    active = -1;
                }
            });

            $title.hover(function () {
                if (active !== -1) {
                    var i = Number(this.dataset.id);

                    menus[active].css({ display: 'none' });
                    menus[i].css({ display: 'inline-block' });
                    active = i;
                }
            });
        }

        $bar.append($titles);
    }

    function createMenus() {
        for (var i = 0; i < menuData.length; i++) {
            var $menus = $('<ul class="menus"></ul>');
            var items = menuData[i].menuItems;

            for (var j = 0; j < items.length; j++) {
                if (items[j].title === 'hr') {
                    var $hr = $('<li class="menu-hr"></li>');
                    $menus.append($hr);
                    continue;
                }

                var $menu = $('<li class="menu-item"></li>');

                $menu.html(items[j].title);
                $menu.attr('data-x', i);
                $menu.attr('data-y', j);

                if (items[j].shortcut !== '') {
                    var $shorcut = $('<span class="kjkey"></span>');

                    $shorcut.html(items[j].shortcut);
                    $menu.append($shorcut);
                }

                if (!items[j].enabled) $menu.addClass('forbid');

                $menus.append($menu);

                $menu.click(function () {
                    if ($(this).hasClass('forbid')) return;

                    var i = this.dataset.x, j = this.dataset.y;

                    menuData[i].menuItems[j].handler();
                    menus[i].css({ display: 'none' });
                    active = -1;
                });
            }

            $menus.css({
                width: menuData[i].width,
                left: menuData[i].left,
                display: 'none'
            });

            $bar.append($menus);
            menus.push($menus);
        }
    }

    
    function checked(row, col, isChecked) {
        var menuItem = menus[row].find('.menu-item')[col];

        if (isChecked) {
            $(menuItem).prepend($('<span class="checked">✓</span>')[0]);
        } else {
            $(menuItem).find('.checked').remove();
        }
    }

    
    function enabled(row, col, isEnabled) {
        var menuItem = menus[row].find('.menu-item')[col];
        if (isEnabled) {
            $(menuItem).removeClass('kjkey');
        } else {
            $(menuItem).addClass('kjkey');
        }
    }

    function hideMenu() {
        if (active === -1) return;

        menus[active].css({ display: 'none' });
        active = -1;
    }

    function init() {
        createMenuTitle();
        createMenus();

        $('body').append($bar);
    }

    function show(data) {
        menuData = data;
        init();
    }

    return {
        show: show,
        checked: checked,
        enabled: enabled,
        hideMenu: hideMenu
    };
}());