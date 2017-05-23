/*
* BSD License for Pointer Events Polyfill
* (http://github.com/kmewhort/pointer_events_polyfill)
*
* Copyright (c) 2013, Kent Mewhort
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the
*
* following conditions are met:
*
*     Redistributions of source code must retain the above copyright notice,
*     this list of conditions and the following disclaimer.
*     Redistributions in binary form must reproduce the above copyright notice,
*     this list of conditions and the following disclaimer in the
*     documentation and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
 * Pointer Events Polyfill: Adds support for the style attribute
 * "pointer-events: none" to browsers without this feature (namely, IE).
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 */

// constructor
function PointerEventsPolyfill(options) {
    // set defaults
    this.options = {
        selector: '*',
        mouseEvents: ['click', 'dblclick', 'mousedown', 'mouseup'],
        usePolyfillIf: function() {
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
                /* jshint ignore:start */
                var agent = navigator.userAgent;
                if (agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null) {
                    var version = parseFloat(RegExp.$1);
                    if (version < 11)
                      return true;
                }
                /* jshint ignore:end */
            }
            return false;
        }
    };
    if (options) {
        var obj = this;
        $.each(options, function(k, v) {
          obj.options[k] = v;
        });
    }

    if (this.options.usePolyfillIf())
      this.register_mouse_events();
}


/**
 * singleton initializer
 *
 * @param   {object}    options     Polyfill options.
 * @return  {object}    The polyfill object.
 */

PointerEventsPolyfill.initialize = function(options) {
/* jshint ignore:start */
    if (PointerEventsPolyfill.singleton == null)
      PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
/* jshint ignore:end */
    return PointerEventsPolyfill.singleton;
};


/**
 * handle mouse events w/ support for pointer-events: none
 */
PointerEventsPolyfill.prototype.register_mouse_events = function() {
    // register on all elements (and all future elements) matching the selector
    $(document).on(
        this.options.mouseEvents.join(' '),
        this.options.selector,
        function(e) {
        if ($(this).css('pointer-events') == 'none') {
             // peak at the element below
             var origDisplayAttribute = $(this).css('display');
             $(this).css('display', 'none');

             var underneathElem = document.elementFromPoint(
                e.clientX,
                e.clientY);

            if (origDisplayAttribute)
                $(this)
                    .css('display', origDisplayAttribute);
            else
                $(this).css('display', '');

             // fire the mouse event on the element below
            e.target = underneathElem;
            $(underneathElem).trigger(e);

            return false;
        }
        return true;
    });
};
