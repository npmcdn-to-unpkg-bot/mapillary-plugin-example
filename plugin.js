define(function (require) {
    // var basePath = "https://devd.io/";
    // var WndPanelView = require("https://devd.io/panel.js");

    var basePath = "https://herecommunity.github.io/mapillary-plugin-example/";
    var WndPanelView = require("https://herecommunity.github.io/mapillary-plugin-example/panel.js");

    var plugin = {
        init: function (pI, data) {

            // setTimeout(function () {
            console.log("plugin init");
            var that = this;

            this.pI = pI;
            this.marker = null;
            this.panel = null;


            pI.createPanel({
                title: "Mapillary",
                navIcon: basePath + "eye.svg",
                onShow: function () {
                    console.log("onShow Panel");

                    if (that.panel == null) {
                        that.panel = new WndPanelView({
                            closeCb: function () {
                                pI.closePanel();
                            }.bind(this)
                        });


                        // setTimeout(function () {
                            that.panel.render(data.key);
                            that.panel.startup();
                            that.panel.show();
                        // }, 1000);
                    }
                    else {
                        that.panel.show();
                    }

                    that.panel.onViewMoved(function (node) {
                        that.showMarker(node.latLon.lat, node.latLon.lon, 0);
                    });
                },
                onHide: function () {
                    console.log("onHide Panel");
                    that.panel.hide();
                }
            });

            var myPanel = pI.getPanel();
            myPanel.parentNode.setAttribute("style", "display:none");

            pI.addContextMenuOption({
                title: "Show in Mapillary",
                menuType: "NVT_GROUND",
                onClick: function (hashmap) {
                    that.updatePosition(hashmap);
                }
            });
            pI.addContextMenuOption({
                title: "Show in Mapillary",
                menuType: "NVT_LINK",
                onClick: function (hashmap) {
                    that.updatePosition(hashmap);
                }
            });
            // }, 0);
        },

        updatePosition: function (hashmap) {
            this.pI.openPanel();
            this.showMarker(hashmap.coord.latitude, hashmap.coord.longitude, 0);
            if (this.panel != null) {
                this.panel.viewCloseTo(hashmap.coord.latitude, hashmap.coord.longitude);
            }
        },

        showMarker: function (lat, lon, heading) {
            var sandwichMap = this.pI.sandwichMap();
            if (!sandwichMap) return;

            if (!this.marker) {
                this.marker = sandwichMap.getLayers(1).addFeature({
                    type: 'Feature',
                    geometry: {
                        type: 'Point', coordinates: [lon, lat,]
                    },
                    properties: {}
                }, [
                        // [0,{src:'icon.jpg',width:20,height:30,offsetX: -10,offsetY:10}]
                        [1, { width: 20, fill: '#00FF00', stroke: '#00FF00', rotation: 45 }],
                        [2, { r: 6, fill: '#00FF00', stroke: '#0000FF' }],
                        //[3,{'text':'mytext',/* textRef: ''*/}
                    ]
                );
                console.log(this.marker);
            }
            else {
                sandwichMap.getLayers(1).modifyFeatureCoordinates(this.marker, [lon, lat,]);
            }
        }

    };



    return plugin;
});
