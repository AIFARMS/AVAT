const fabric = require("fabric").fabric;

var boundingbox = fabric.util.createClass(fabric.Rect, {
    type: 'boundingbox',
    initialize: function(options) {
        options || (options = { });

        this.callSuper('initialize', options);
        this.set('label', options.label || '');
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            label: this.get('label')
        });
    },

    _render: function(ctx) {
        this.callSuper('_render', ctx);

        ctx.font = '10px Helvetica';
        ctx.fillStyle = '#333';
        /* scaleX = this.width / (this.width * this.scaleX),
        scaleY = this.height / (this.height * this.scaleY); */
        ctx.fillText(this.label, (-this.width/2), (-this.height/2 + 20));
        ctx.uniScaleTransform = false;
    }
});
  
export {boundingbox};