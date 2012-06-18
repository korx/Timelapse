/*! © 2012 Korx Limited */
/*

license: 
  - MIT-style

authors: 
  - Michael Bird <michael.bird@korx.com>

*/

var r = 100;
var _r = 100;
var attached = false;

function attach() {
    if (!attached) {
        attached = true;
        var elements = document.body.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            listen(elements[i]);
        }
        listen(document.body);
    }
}

function listen(element) {
    /* TODO: very slow...
    element.addEventListener('DOMNodeInserted', function(e){
        listen(e.target);
    }, false);*/
    timelapse(element);
}

function apply() {
    var elements = document.body.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        timelapse(elements[i]);
    }
}

function timelapse(element) {
    if (r != _r) {
        var styles = window.getComputedStyle(element, null);
        if (typeof element.timelapse != 'object') {
            element.timelapse = {
                webkitAnimationDelay: styles.webkitAnimationDelay,
                webkitAnimationDuration: styles.webkitAnimationDuration,
                webkitTransitionDelay: styles.webkitTransitionDelay,
                webkitTransitionDuration: styles.webkitTransitionDuration
            };
        }
        if (element.timelapse.webkitAnimationDelay != '' && element.timelapse.webkitAnimationDelay != '0' && element.timelapse.webkitAnimationDelay != '0s' && element.timelapse.webkitAnimationDelay != '0ms') {
            element.style['-webkit-animation-delay'] = calc(element.timelapse.webkitAnimationDelay);
        }
        if (element.timelapse.webkitAnimationDuration != '' && element.timelapse.webkitAnimationDuration != '0' && element.timelapse.webkitAnimationDuration != '0s' && element.timelapse.webkitAnimationDuration != '0ms') {
            element.style['-webkit-animation-duration'] = calc(element.timelapse.webkitAnimationDuration);
        }
        if (element.timelapse.webkitTransitionDelay != '' && element.timelapse.webkitTransitionDelay != '0' && element.timelapse.webkitTransitionDelay != '0s' && element.timelapse.webkitTransitionDelay != '0ms') {
            element.style['-webkit-transition-delay'] = calc(element.timelapse.webkitTransitionDelay);
        }
        if (element.timelapse.webkitTransitionDuration != '' && element.timelapse.webkitTransitionDuration != '0' && element.timelapse.webkitTransitionDuration != '0s' && element.timelapse.webkitTransitionDuration != '0ms') {
            element.style['-webkit-transition-duration'] = calc(element.timelapse.webkitTransitionDuration);
        }
    }
}

function calc(value) {
    var amount = parseFloat(value);
    var unit = '';
    if (value.length >= 2 && value.slice(-2) == 'ms') {
        amount = parseFloat(value.slice(0, -2));
        unit = 'ms';
    } else if (value.length >= 1 && value.slice(-1) == 's') {
        amount = parseFloat(value.slice(0, -1));
        unit = 's';
    }
    if (amount > 0) {
        return ((amount / 100) * r) + unit;
    } else {
        return '0';
    }
}

document.addEventListener('DOMContentLoaded', function(){

    safari.self.addEventListener('message', function(e){
        if (e.name == 'rate') {
            _r = r;
            r = e.message;
            if (r != _r) {
                if (!attached) {
                    attach();
                } else {
                    apply();
                }
            }
        }
    }, false);

    safari.self.tab.dispatchMessage('rate');

});
