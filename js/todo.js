$(document)
    .ready(function () {

        let todoListfilterType = "all"
        const todoList = [];
        const buildToDoItem = (element) => `<li id=${element.id} class="${element.complete
            ? "checked"
            : ""}"><input name="done-todo" ${element.complete
                ? 'checked'
                : ""} type="checkbox" class="done-todo" /><span> ${element.name}</span> </li>`

        function generateUUID() {
            /*jshint bitwise:false */
            var i,
                random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12
                    ? 4
                    : (i === 16
                        ? (random & 3 | 8)
                        : random)).toString(16);
            }
            return uuid;
        }

        function addItem() {
            var toAdd = $('input[name=ListItem]').val();

            todoList.push({id: generateUUID(), name: toAdd, complete: false});

            renderTodoList();

            $('input[name=ListItem]').val("");
        }

        function renderTodoList() {

            const filterExecute = (element) => [
                {
                    filter: "all",
                    return: true
                }, {
                    filter: "active",
                    return: !element.complete
                }, {
                        filter: "complete",
                        return: element.complete
                    }
                ]
                .find(element => element.filter === todoListfilterType)
                .return;;
            const olHtml = todoList
                .filter(filterExecute)
                .map(element => buildToDoItem(element))
                .reduce((element1, element2) => element1 + element2, "");
            $('ol').html(olHtml);
        }

        $('#filters li a')
            .click(function (e) {
                e.preventDefault();
                const filterType = $(this).data('filter');
                todoListfilterType = filterType;
                renderTodoList();

                $("#filters li a").removeClass("selected");
                $(this).addClass("selected");

            });

        $('#button').click(addItem);

        $("input[name=ListItem]").keyup(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                addItem();
            }
        });

        $(document).on('click', 'input[name=done-todo]', function (event) {
            $(this)
                .parent()
                .toggleClass('checked');

            todoList
                .find(element => element.id === $(this).parent()[0].id)
                .complete = $(this)
                .parent()
                .hasClass('checked');
        });

        $(document).on('dblclick', 'li', function () {
            $(this)
                .children('span')
                .attr('contentEditable', 'true')
                .focus()
                .keypress(function (event) {
                    var keycode = (event.keyCode
                        ? event.keyCode
                        : event.which);
                    if (keycode == '13') {
                        // when editing and press enter, take off contenteditable attr and set outline
                        // none to take the focus off
                        event
                            .target
                            .blur();
                        $(this)
                            .children('span')
                            .attr('contenteditable', 'false');

                        todoList
                            .find(element => element.id === $(this).parent()[0].id)
                            .name = $(this).text();
                        renderTodoList();
                    }
                });

        });

        $('input').focus(function () {
            $(this).val('');
        });;

    });