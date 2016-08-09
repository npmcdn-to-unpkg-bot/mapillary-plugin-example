
define(function (require) {

    var mapillaryHtml = '<style>\
    .mly-wrapper {\
      position: relative;\
      background-color: grey;\
      width: 100%;\
      height: 100%;\
    }\
    #mly, .mapillary-js {\
      position: relative;\
      height: 100%;\
      width: 100%;\
    }\
</style>\
<link href="https://npmcdn.com/mapillary-js@1.6.0/dist/mapillary-js.min.css" rel="stylesheet">\
<div class="mly-wrapper"><div id="mly"></div></div>';

    var Config = require('Config');
    var View = require('base/View'),
        WindowView = require('view/WindowView');
    var Mapillary = require("https://npmcdn.com/mapillary-js@1.6.0/dist/mapillary-js.min.js");


    var wndPanelView = View.extend({

        render: function (key) {
            $("#mapillary-panel").length == 0 && $('body').prepend('<div id="mapillary-panel"></div>');
            $("#mapillary-panel").html("");

            this.wndView = new WindowView(
                {
                    el: "#mapillary-panel",
                    className: "",
                    title: "Mapillary",
                    withEffect: true,
                    cookie: "wnd-mapillary",
                    position: { left: 140, width: 100, height: 100 },
                    closeCb: this.options.closeCb
                });
            this.wndView.render();
            this.$mapillary = this.wndView.getContentEl();
            this.key = key;
            // this.$mapillary.prepend(mapillaryHtml);
            // this.mly = new Mapillary.Viewer("mly", this.key, "ytfE1_iD_N-jmHfTHkj1Ug", { "cover":false });

            return this;
        },

        startup: function() {
            this.$mapillary.prepend(mapillaryHtml);
            this.mly = new Mapillary.Viewer("mly", this.key, "ytfE1_iD_N-jmHfTHkj1Ug", { "cover":false });            
        },

        show: function() {
            this.wndView.show();            
        },

        hide: function() {
            this.wndView.close();
        },

        mapillary: function() {
            if(!this.mly) return null;
            return this.mly();
        },

        viewCloseTo: function(lat, lon) {
            if(!this.mly) return;
            this.mly.moveCloseTo(lat, lon);
        },

        onViewMoved: function(handler) {
            if(!this.mly) return;            
            this.mly.on('nodechanged', handler);
        },

        remove: function () {
            this.wndView && this.wndView.remove();
            Backbone.View.prototype.remove.call(this, arguments);
        }
    });
    return wndPanelView;

});
