/** import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

import {BoundingBox} from '../annotations/bounding_box'

let modelPromise;

export async function load(model_type) {
    alert("Loading model\nThis might take a second or so...")
    const model = await cocoSsd.load();
    model.dispose();
    modelPromise = cocoSsd.load({base: model_type});
}

export async function run_model(fabricCanvas, annotation_data, currentFrame, save_data, refresh) {
    const image = document.getElementsByTagName("video")[0]
    console.log(image.height)

    console.log("IMAGE CLASSIFICATION")
    const model = await modelPromise;
    console.log('model loaded');
    console.time('predict1');
    const result = await model.detect(image);
    console.timeEnd('predict1');

    for (let i = 0; i < result.length; i++) {
        var box = result[i].bbox
        var color = "#" + ((1<<24)*Math.random() | 0).toString(16)
        var new_bbox = new BoundingBox(box[1], box[0], box[2], box[3], color, i+'b', "None").generate_no_behavior(fabricCanvas)
        fabricCanvas.add(new_bbox)
        annotation_data[currentFrame].push({id: i+'b', global_id: i,status: "", current: "", behavior: "", posture: "", notes: ""})
    } 
    save_data(currentFrame)
    refresh()
    /*
    const c = document.getElementById('canvas');
    const context = c.getContext('2d');
    //context.drawImage(image, 0, 0);
    context.font = '10px Arial';

    console.log('number of detections: ', result.length);
    for (let i = 0; i < result.length; i++) {
        context.beginPath();
        context.rect(...result[i].bbox);
        context.lineWidth = 3;
        context.strokeStyle = 'red';
        context.fillStyle = 'red';
        context.stroke();
        context.fillText(
            result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
            result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
    }
    console.log(result)
    //alert(JSON.stringify(result))
}; */