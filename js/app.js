$(document).ready(function() {

    // retrieve books list on document load
    function getBooks() {
        ajaxHandler('', '', 'GET', showBooks);
    }

    //display books titles
    function showBooks(r) {
        var books = $('.books');
        books.html('');
        for (var i = 0; i < r.length; i++) {
                books.append('<div class="book"><span class="title" data-id="'+r[i].id+'">'+r[i].title+'</span><div class="delete btn btn-primary" data-id="'+r[i].id+'">delete</div><div class="details"></div></div>');

        }
    }

    //retrieve and show single book details on click
    function getBook() {
        clickHandler('.books', 'span', ajaxHandler);
    }

    //show single book details
    function showBook(r) {
        var nextElement = $('.title[data-id='+r.id+']').siblings('.details'),
            genres = ['Romans', 'Obyczajowa', 'Sci-fi i fantasy', 'literatura faktu', 'Popularnonaukowa', 'Poradnik', 'Kryminał, sensacja'],
            genre = genres[r.genre - 1];

        if (nextElement.children().length == 0) {
            nextElement.append('<span> Autor: '+r.author+'</span></br><span> ISBN: '+r.isbn+'</span></br><span> Gatunek: '+genre+'</span></br><span> Wydawca: '+r.publisher+'</span>');
        } else {
            nextElement.toggle();
        }
    }

    //add new book
    function addBook() {
        clickHandler('#submit', '', ajaxHandler);
    }

    //delete book
    function deleteBook() {
        clickHandler('.books', '.delete', ajaxHandler);
    }

    //ajax
    function ajaxHandler(url, data, type, callback) {
        $.ajax({
                url: 'http://127.0.0.1:8000/book/' + url,
                data: data,
                type: type,
                dataType: 'json'
            }).done(function(result) {
                console.log(result);
                callback(result)
            }).fail(function(xhr, status, err){
                console.log(xhr, status, err);
            }).always(function(xhr, status){
                //console.log(xhr, status);
        });
    }

    //click
    function clickHandler(element, child, callback) {
        $(element).on('click', child, function(e){

            // click on title to show single book details
            if (element == '.books' && child == 'span') {
                callback($(this).data('id'), '', 'GET', showBook);
                $(this).toggleClass('bold');
            }
            //click on submit button to add a new book
            if (element == '#submit') {
                e.preventDefault();
                validateForm();
                if ($('#error_message').html() == '') {
                    var data = {
                        title: $('#title').val(),
                        author: $('#author').val(),
                        isbn: $('#isbn').val(),
                        publisher: $('#publisher').val(),
                        genre: $('#genre').val()
                    };
                    callback('', data, 'POST', getBooks);

                    $('#title').val('');
                    $('#author').val('');
                    $('#isbn').val('');
                    $('#publisher').val('');
                    $('#genre').val('0');
                }
            }
            //click on delete button to delete selected book
            if (element == '.books' && child == '.delete') {
                callback($(this).data('id'), '', 'DELETE', getBooks);
            }
        })
    }

    //validate form
    function validateForm() {
        var inputs = $('input:not([type="submit"])'),
            names = ['Autor', 'Tytuł', 'ISBN', 'Wydawca'],
            result = '',
            isbn = $('#isbn').val(),
            error_message = $('#error_message');

        error_message.html('');

        inputs.each(function(i, elem){
            if($(this).val() == '') {
                result += 'Pole '+ names[i] +' nie może być puste </br>';
            }
        });
        if ($('select').val() == '0') {
            result += 'Pole Gatunek nie może być puste </br>'
        }
        if ((!(isbn.length == 17)) || /[^0-9\-]/.test(isbn)) {
            result += 'Pole ISBN musi składać się z 13 cyfr </br>'
        }

        error_message.html(result);
    }

    getBooks();
    getBook();
    addBook();
    deleteBook();

});