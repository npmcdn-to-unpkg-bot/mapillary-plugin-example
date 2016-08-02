
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
<link href="https://npmcdn.com/mapillary-js@1.0.1/dist/mapillary-js.min.css" rel="stylesheet">\
<div class="mly-wrapper"><div id="mly"></div></div>';

    var Config = require('Config');
    var View = require('base/View'),
        WindowView = require('view/WindowView');
    var Mapillary = require("https://npmcdn.com/mapillary-js@1.0.1/dist/mapillary-js.min.js");


    var wndPanelView = View.extend({

        render: function () {
            $("#mapillary-panel").length == 0 && $('body').append('<div id="mapillary-panel"></div>');
            $("#mapillary-panel").html("");
                    console.log(this.options);

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
            // this.wndView.show();
            this.$mapillary = this.wndView.getContentEl();
            this.$mapillary.prepend(mapillaryHtml);
            this.mly = new Mapillary.Viewer("mly", "ZXlNWExWZ2dmQ1lJUlZPNTUyOXJxUTo5MzQyNWUzNDVkNWU5YzE2","ytfE1_iD_N-jmHfTHkj1Ug");

            return this;
        },

        show: function() {
            this.wndView.show();
        },

        hide: function() {
            // this.$mapillary.html("<h1>hello</h1>");
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
