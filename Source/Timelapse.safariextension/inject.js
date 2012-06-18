/*! © 2012 Korx Limited */
/*

license: 
  - MIT-style

authors: 
  - Michael Bird <michael.bird@korx.com>

*/

(function(){

    var r = 100; // current rate value
    var _r = 100; // previous rate value
    var attached = false; // if we've attached to the elements yet

    // attach to all elements in the DOM tree
    var attach = function() {
        // only attach once
        if (!attached) {
            attached = true;
            // loop through all elements in the document body
            var elements = document.body.getElementsByTagName('*');
            for (var i = 0; i < elements.length; i++) {
                // listen to the element
                listen(elements[i]);
            }
            // also listed on the document body itself
            listen(document.body);
        }
    }

    // listen for element changes and apply timelapse appropriately
    var listen = function(element) {
        // check for new node inserted
        element.addEventListener('DOMNodeInserted', function(e){
            // listen to the new node
            listen(e.target);
        }, false);
        // apply timelapse
        timelapse(element);
    }

    // apply timelapse to all elements in the document body
    var apply = function() {
        // loop through all elements in the document body
        var elements = document.body.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            // timelapse the element
            timelapse(elements[i]);
        }
    }

    // apply percentage rate to duration and delay of CSS properties
    var timelapse = function(element) {
        // make sure the rate has changes
        if (r != _r) {
            // get the computed style of the element
            var styles = window.getComputedStyle(element, null);
            // if the original values haven't been saved, save them now
            if (typeof element.timelapse != 'object') {
                element.timelapse = {
                    webkitAnimationDelay: styles.webkitAnimationDelay,
                    webkitAnimationDuration: styles.webkitAnimationDuration,
                    webkitTransitionDelay: styles.webkitTransitionDelay,
                    webkitTransitionDuration: styles.webkitTransitionDuration
                };
            }
            // check each CSS property and apply calcualtion of current rate to the original value
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

    // calcualtes the new time based on the value and current rate
    var calc = function(value) {
        // get the value as a float
        var amount = parseFloat(value);
        var unit = '';
        // check if it's in milliseconds or seconds
        if (value.length >= 2 && value.slice(-2) == 'ms') {
            amount = parseFloat(value.slice(0, -2));
            unit = 'ms';
        } else if (value.length >= 1 && value.slice(-1) == 's') {
            amount = parseFloat(value.slice(0, -1));
            unit = 's';
        }
        // if the time is more than 0 seconds then apply the rate percentage
        if (amount > 0) {
            return ((amount / 100) * r) + unit;
        } else {
            return '0';
        }
    }

    // start up once the content has loaded
    document.addEventListener('DOMContentLoaded', function(){

        // listen for the rate setting
        safari.self.addEventListener('message', function(e){
            if (e.name == 'rate') {
                // update r values
                _r = r;
                r = e.message;
                if (r != _r) {
                    // attach or apply the new rate
                    if (!attached) {
                        attach();
                    } else {
                        apply();
                    }
                }
            }
        }, false);

        // get the current rate
        safari.self.tab.dispatchMessage('rate');

    });

})();