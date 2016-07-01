define(function (require) {
    // var basePath = "https://devd.io/";
    // var WndPanelView = require("https:/devd.io/panel.js");

    var basePath = "https://herecommunity.github.io/mapillary-plugin-example/";
    var WndPanelView = require("https://herecommunity.github.io/mapillary-plugin-example/panel.js");

    var panel = new WndPanelView({
        closeCb: function () {
            //what should happen after the wnd is destroyed
        }.bind(this)
    });
    panel.render();




    var plugin = {
        init: function (pI) {

            // setTimeout(function () {
            console.log("plugin init");
            var that = this;

            this.pI = pI;
            this.marker = null;
            // debugger;
            window.pI = pI;

            pI.createPanel({
                title: "Mapillary",
                navIcon: basePath + "eye.svg",
                onShow: function () {
                    console.log("onShow Panel");
                    var sandwichMap = that.pI.sandwichMap();
                    if (sandwichMap && sandwichMap.getZoomLevel() >= 16) {
                        panel.show();
                        panel.onViewMoved(function (node) {
                            that.showMarker(node.latLon.lat, node.latLon.lon, 0);
                        });


                        if (sandwichMap) {
                            sandwichMap.addObserver('zoomLevel', function (t, current, old) {
                                if (current <= 17 && old > current) {
                                    console.log("zoom hide!!");
                                    panel.hide();
                                    that.pI.closePanel();
                                }
                            })
                        }
                    }
                    else {
                        that.pI.closePanel();
                    }
                },
                onHide: function () {
                    console.log("onHide Panel");
                    panel.hide();
                    that.pI.closePanel();
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

            console.log(this.map);
            this.showMarker(hashmap.coord.lat, hashmap.coord.lon, 0);

            // panel.show();
            panel.viewCloseTo(hashmap.coord.lat, hashmap.coord.lon);
            console.log(hashmap);
        },

        showMarker: function (lat, lon, heading) {
            var sandwichMap = this.pI.sandwichMap();
            if (!sandwichMap) return;

            if (!this.marker) {
                this.marker = sandwichMap.getLayers(1).addFeature({
                    type: 'Feature',
                    geometry: {
                        type: 'Point', coordinates: [lon, lat,]
                    }
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
                // debugger;
                sandwichMap.getLayers(1).modifyFeatureCoordinates(
                    this.marker, [lon, lat,]);
                // this.marker
            }
        }

    };



    return plugin;
});
