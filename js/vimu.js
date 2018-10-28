var isEditing = false;
var showKeyboard = true;
var showLetters = true;
var theme = "blue";
var colorWell;
var defaultColor = "#0000ff";

$( document ).ready(function() {
    $('#customization-container').hide();
    $('#file-directory').hide();
    $('.ldBar-container').css("visibility", "hidden");

    // settings popover
    $('#settings').popover({
        html: true,
        content: function() {
            return $('#settings-popover').html();
        }
    }).on('shown.bs.popover', function() {});
});

function toggleEditing() {
    if (isEditing) {
        // navigation bar
        isEditing = false;
        $('#lock').removeClass('active-btn');
        $('#lock > i').removeClass('fa-unlock').addClass('fa-lock');
        $('#settings').prop('disabled', false);
        $('#settings').css('color', '');

        // layout
        $('#myCanvas').show();
        $('#customization-container').hide();
        $('#file-directory').hide();
        $('#keyboard-audio-visual').removeClass('col-10'); // make keyboard back to full width
        $('.keyboard-key-edit').removeClass('keyboard-key-edit').addClass('keyboard-key');
        $('.keyboard-row-edit').removeClass('keyboard-row-edit').addClass('keyboard-row');
        $('.ldBar-container').css("visibility", "hidden");

        // return back to original settings
        if (!showKeyboard) {
            $('#keyboard').hide();
            $('#display-keyboard').attr("checked", false);
        } else {
            $('#keyboard').show();
            $('#display-keyboard').attr("checked", true);
        }
        if (!showLetters) {
            $('.keyboard-key').contents().hide();
            $('#display-labels').attr("checked", false);
        } else {
            $('.keyboard-key').contents().show();
            $('#display-labels').attr("checked", true);
        }
    } else {
        // navigation bar
        isEditing = true;
        $('#lock').addClass('active-btn');
        $('#lock > i').removeClass('fa-lock').addClass('fa-unlock');
        $('#settings').prop('disabled', true);
        $('#settings').popover('hide');
        $('#settings').css('color', 'lightgrey');

        // layout
        $('#myCanvas').hide();
        $('#customization-container').show();
        $('#file-directory').show();
        $('#keyboard-audio-visual').addClass('col-10'); // make keyboard smaller
        $('.keyboard-key').removeClass('keyboard-key').addClass('keyboard-key-edit');
        $('.keyboard-row').removeClass('keyboard-row').addClass('keyboard-row-edit');
        $('.ldBar-container').css("visibility", "collapse");
        $('.ldBar').css("visibility", "hidden");

        // must show keyboard and letters in editing mode
        if (!showKeyboard) {
            $('#keyboard').show();
        }
        if (!showLetters) {
            $('.keyboard-key-edit').contents().show();
        }
    }
}

function toggleLabels(element) {
    if (element.checked) {
        $('.keyboard-key').contents().show();
        showLetters = true;
    } else {
        $('.keyboard-key').contents().hide();
        showLetters = false;
    }
}

function toggleKeyboard(element) {
    if (element.checked) {
        $('#keyboard').show();
        showKeyboard = true;
    } else {
        $('#keyboard').hide();
        showKeyboard = false;
    }
}

// set theme
function setTheme(colour) {
    var row1 = $('.row1');
    var row2 = $('.row2');
    var row3 = $('.row3');
    var row4 = $('.row4');
    var row5 = $('.row5');

    switch (colour) {
        case "blue":
            row1.css('background-color', '#62C9D3');
            row2.css('background-color', '#82CDDE');
            row3.css('background-color', '#A2D8E7');
            row4.css('background-color', '#C5E4F1');
            row5.css('background-color', '#E6F4FD');
            theme = "blue";
            break;
        case "green":
            row1.css('background-color', '#9AC87D');
            row2.css('background-color', '#AFD299');
            row3.css('background-color', '#C1DEB3');
            row4.css('background-color', '#D6EACC');
            row5.css('background-color', '#F1F7E4');
            theme = "green";
            break;
        case "red":
            row1.css('background-color', '#DB8F8E');
            row2.css('background-color', '#E0A9AA');
            row3.css('background-color', '#EBBAB9');
            row4.css('background-color', '#F7D5D6');
            row5.css('background-color', '#FDEEEE');
            theme = "red";
            break;
        case "orange":
            row1.css('background-color', '#DE7C62');
            row2.css('background-color', '#E69276');
            row3.css('background-color', '#F5AF92');
            row4.css('background-color', '#F2BAAA');
            row5.css('background-color', '#FCD4CA');
            theme = "orange";
            break;
    }
}

// add shadow lighting on keypress
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event){
    if (!isEditing) {
        var key = event.key.toUpperCase();
        if (key.length > 1) { // not alphanumeric
            return;
        }

        var code = key.charCodeAt(0);
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code === 32)) { // space

            if (key === ' ') {
                key = 'spacebar';
            }
            var element = $('#' + key);
            var elementParent = $(element).parent().parent()[0];
            // console.log(event.key);
            // console.log(elementParent);

            addShadow(elementParent);

            if ($(element).text()) {
                showLoadingBar(key);
            }
        }
    }
}

function addShadow(elementParent) {
    $(elementParent).css('transition', 'opacity .2s');
    $(elementParent).css('opacity', '1');

    switch (theme) {
        case "blue":
            $(elementParent).css('box-shadow', '0 0 15px 10px #89D8E7');
            break;
        case "green":
            $(elementParent).css('box-shadow', '0 0 15px 10px #98DB76');
            break;
        case "red":
            $(elementParent).css('box-shadow', '0 0 15px 10px #EBBAB9');
            break;
        case "orange":
            $(elementParent).css('box-shadow', '0 0 15px 10px #F48255');
            break;
    }
}

function showLoadingBar(key) {
    $.getScript('js/loading-bar.js', function() {
        // script is now loaded and executed.
        // put your dependent JS here.

        var duration = 3000; // it should finish in 3 seconds !

        var keyString = "#ldBar" + key;
        var loadingBar = $(keyString);
        if (loadingBar !== null) {
            var ldBarObj = new ldBar(keyString);
            $(loadingBar).css("visibility", "visible");
            $(loadingBar).animate({
                letterSpacing: 0 // dummy
            }, {
                duration: duration,
                progress: function (promise, progress, ms) {
                    ldBarObj.set(progress * 100);
                },
                complete: function () {
                    $(loadingBar).css("visibility", "hidden");
                }
            });
        }
    });
}

function handleKeyUp(event) {
    if (!isEditing) {
        var key = event.key.toUpperCase();

        if (key.length > 1) { // not alphanumeric
            return;
        }
        var code = key.charCodeAt(0);
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code === 32)) { // space

            if (key === ' ') {
                key = 'spacebar';
            }
            var element = $('#' + key);
            var elementParent = $(element).parent().parent()[0];

            removeShadow(elementParent);
        }
    }
}

function removeShadow(elementParent){
    $(elementParent).css('transition', 'opacity .2s');
    $(elementParent).css('opacity', '');
    $(elementParent).css('box-shadow', '');
}

// drag and drop
function allowDrop(ev) {
    if (isEditing) {
        ev.preventDefault();
    }
}

function drag(ev) {
    if (isEditing) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
}

function drop(ev) {
    if (isEditing) {
        ev.preventDefault();
        var draggedId = ev.dataTransfer.getData("text");
        var draggedData = document.getElementById(draggedId).textContent;

        // ev.target    -> is div when dragging to empty slot
        //             -> is p when dragging to occupied slot

        var targetId;
        if (ev.target.getElementsByTagName('p').length !== 0) {
            targetId = ev.target.getElementsByTagName('p')[0].id;
        } else {
            targetId = ev.target.id;
        }
        var targetData = document.getElementById(targetId).textContent;

        document.getElementById(draggedId).textContent = targetData;
        document.getElementById(targetId).textContent = draggedData;
    }
}

window.addEventListener("load", startup, false);

function startup() {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = defaultColor;
  colorWell.addEventListener("input", updateFirst, false);
  colorWell.addEventListener("change", updateAll, false);
  colorWell.select();
}

function updateFirst(event) {
  var p = document.querySelector("p");

  if (p) {
    p.style.color = event.target.value;
  }
}

function updateAll(event) {
  document.querySelectorAll("p").forEach(function(p) {
    p.style.color = event.target.value;
  });
}