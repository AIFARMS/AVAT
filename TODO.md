## TODO

## Deployment:
* [x] Have testing build pre-compiled
* [x] Dev website
* [x] Github actions
* [ ] Live website

## Features
* [x] Bounding Boxes
* [x] Segmentation
* [x] Change global_id manually
* [x] Change behavior manually
* [x] Change posture manually
* [x] Ability to scale with screen/computer resolution
* [x] Display annotations on the side
* [ ] Key Point
* [ ] Persisting annotations through frames

## Extra Features
* [ ] Have the frame follow the animal's movement through the frames
* [ ] Automatically guesstimate boxes for pigs based on background subtraction

## Data Management
* [x] Export data as CSV or JSON
* [x] Global ID
* [x] Import previous annotation data to continue annotations
* [x] Combine annotation_data with frame_data instead of 2 Separate files
* [ ] Load video in chunks for larger file sizes to prevent high RAM usage
* [ ] ~~Import JSON data from Matlab tool~~
* [ ] ~~Separate file for behavior + posture + column list~~
* [ ] Store time (seconds) along with frame data
* [ ] CSV export accuracy

## AI Assisted Annotations
* [ ] Tensorflow integration
* [ ] Bounding box generation using COCO
* [ ] Segmentation generation
* [ ] Ability for custom models to be added

## SOP + Code documentation
* [ ] Document all functions
* [ ] Auto generate documentation
* [ ] Adding new columns SOP
* [ ] Adding new column values SOP 
* [ ] Adding new annotation types SOP

## Testing
* [ ] selection_screen.js test
* [ ] main_upload.js test
* [ ] bounding_box.js test
* [ ] key_point.js test
* [ ] segmentation_edit.js test
* [ ] segmentation.js
* [ ] Tensorflow basic testing (testing model works and generates data)
* [ ] Upload testing
* [ ] Export testing
* [ ] Export accuracy testing

# Future Feature Requests
* [ ] Docker Solution
* [ ] Backend python integration