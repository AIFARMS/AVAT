/*//const tf = require('@tensorflow-models/tfjs-node');
const deeplab = require('@tensorflow-models/deeplab');
const tfconv = require('@tensorflow/tfjs-converter');

const fabric = require("fabric").fabric;
const $ = require("jquery")

const loadModel = async () => {
    const modelName = 'pascal';   // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
    const quantizationBytes = 4;  // either 1, 2 or 4
    return await deeplab.load({base: modelName, quantizationBytes});
  };


export async function load(){

}

export async function run_model_segment(fabricCanvas, annotation_data, currentFrame, save_data, refresh) {
    const image = document.getElementsByTagName("video")[0]
    console.log(image.height)

    loadModel()
    .then((model) => model.segment(image))
    .then(
        ({segmentationMap, width, height, legend}) =>{

            console.log(segmentationMap);
            console.log(fabricCanvas.getHeight())
            console.log(fabricCanvas.getWidth())
            //let width = fabricCanvas.getWidth();
            //let height = fabricCanvas.getHeight();
            var seg_image = new ImageData(segmentationMap, width, height)
            //fabricCanvas.Image(seg_image)

            var c = document.createElement('canvas');

            c.setAttribute('id', '_temp_canvas');
            c.width = width;
            c.height = height;

            c.getContext('2d').putImageData(seg_image, 0, 0);

            fabric.Image.fromURL(c.toDataURL(), function(img) {
                img.left = 0;
                img.top = 0;
                img.opacity = .5;
                img.scaleX = fabricCanvas.getHeight() / height;
                img.scaleY = fabricCanvas.getWidth() / width;
                fabricCanvas.add(img);
                img.bringToFront();
                c = null;
                $('#_temp_canvas').remove();
                fabricCanvas.renderAll();
            });

        });
}
*/