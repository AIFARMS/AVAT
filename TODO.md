## TODO

### Deployment:
[x] Have testing build pre-compiled
[x] Dev website
[ ] Live website
[x] Github actions

### Features
[x] Bounding Boxes
[x] Segmentation
[x] Change global_id manually
[x] Change behavior manually
[x] Change posture manually
[ ] Key Point
[x] Ability to scale with screen/computer resolution
[x] Display annotations on the side
[ ] Persisting annotations through frames

### Extra Features
[ ] Have the frame follow the animal's movement through the frames
[ ] Automatically guesstimate boxes for pigs based on background subtraction

### Data Management
[x] Export data as CSV or JSON
[x] Global ID
[ ] Load video in chunks for larger file sizes to prevent high RAM usage
[ ] Import JSON data from Matlab tool
[ ] Import previous annotation data to continue annotations
[ ] Separate file for behavior + posture + column list
[ ] Store time (seconds) along with frame data
[x] Combine annotation_data with frame_data instead of 2 Separate files

## Future Feature Requests
[ ] Tensorflow integration
[ ] Docker Solution
[ ] Backend python integration