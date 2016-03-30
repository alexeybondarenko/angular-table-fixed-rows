'use strict';

angular.module('table-fixed-rows', [])

  .directive('tableFixedRow', function () {

    function getCoords(elem) {

      var box = elem.getBoundingClientRect();

      var body = document.body;
      var docEl = document.documentElement;

      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;

      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return {
        top: top,
        left: left
      };
    }

    var getClosest = function (elem, selector) {

      var firstChar = selector.charAt(0);
      // Get closest match
      for (; elem && elem !== document; elem = elem.parentNode) {

        if (firstChar === '.') { // If selector is a class
          if (elem.classList.contains(selector.substr(1))) {
            return elem;
          }
        }
        if (firstChar === '#') { // If selector is an ID
          if (elem.id === selector.substr(1)) {
            return elem;
          }
        }
        if (firstChar === '[') { // If selector is a data attribute
          if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
            return elem;
          }
        }
        if (elem.tagName.toLowerCase() === selector) { // If selector is a tag
          return elem;
        }
      }
      return false;

    };

    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      };
    }


    return {
      restrict: 'A',
      controller: function () {

        var $$element = null,
          $$sourceTableElement = null,
          $$clonedElement = null;

        this.init = function (el, tableEl) {

          if ($$element) {
            throw new Error('controller already initialized. call destroy method and after re-init');
          }
          $$sourceTableElement = angular.element(tableEl);

          $$element = angular.element(tableEl[0].cloneNode(false));
          this.refresh(el);

          $$element.addClass('table-fixed-row');
          this.unstick();

          angular.element(document.body).append($$element);


        };
        this.refresh = debounce(function (el) {
          if ($$clonedElement) {
            $$clonedElement.remove();
          }
          [].forEach.call(el[0].querySelectorAll('td,th'), function (cellItem) {
            cellItem.style.width = cellItem.getBoundingClientRect().width + 'px';
          });
          $$element.css({
            width: $$sourceTableElement[0].getBoundingClientRect().width + 'px'
          });

          $$clonedElement = el.clone(true);

          $$element.append($$clonedElement);
        }, 50);

        this.stick = function (top) {
          $$element.css({
            display: '',
            top: top + 'px'
          });
        };
        this.unstick = function () {
          $$element.css({
            display: 'none'
          });
        };
        this.destroy = function () {
          $$element.remove();
        };
      },
      link: function (scope, el, attrs, ctrl) {

        var tableEl = getClosest(el[0], 'table');
        if (!tableEl) throw new Error('table element not found up the dom tree');
        ctrl.init(el, angular.element(tableEl));

        var coords = getCoords(el[0]);
        angular.element(window).bind('scroll', function () {
          var scrolled = window.pageYOffset || document.documentElement.scrollTop;
          if (scrolled > coords.top) {
            ctrl.stick(scrolled);
          } else {
            ctrl.unstick();
          }
        });

        scope.$on('$destroy', function () {
          ctrl.destroy();
        });

        el.on('DOMSubtreeModified propertychange', function () {
          ctrl.refresh(el);
        });

        scope.$on('table-fixed-rows:refresh', function () {
          ctrl.refresh(el);
        })
      }
    }
  });
