import React from "react"; 

export default function Instructions(){
    return (
        <div>
        <h1 id="instructions-for-using-the-avat-platform">Instructions for Using the AVAT Platform</h1>
        <p>The AVAT platform is designed to be accessible for users across various academic disciplines, providing a robust interface for efficient video annotation. This document outlines the key features of the platform, including user interface details, key bindings, and the process for uploading media and annotating videos.</p>
        <p>For a system that spans multiple academic disciplines, ensuring a robust interface allows a person of any experience to efficiently annotate videos. A potential user should be able to identify animals of interest easily and have a method to track them across frames in an easy and efficient manner. For a more efficient workflow, a series of key bindings was implemented to expedite each operation within the platform, therefore allowing unexperienced users to familiarize themselves with a predetermined workflow efficiently.</p>
        <h2 id="overview">Overview</h2>
        <p>AVAT aims to simplify the video annotation process, allowing users to easily identify and track animals of interest across frames. A significant challenge addressed was conditioning users to adopt a predetermined workflow for increased efficiency, even without prior intensive training on our system.</p>
        <h2 id="browser-support">Browser Support</h2>
        <p>The following browsers are supported by the AVAT platform. If you encounter any errors, we recommend using the latest version of Chrome or Firefox, as these have been extensively tested:</p>
        <ul>
        <li>Chrome 49 (release: 2/3/2016)</li>
        <li>Firefox 50 (release: 11/15/2016)</li>
        <li>Safari 10 (release: 9/20/2016)</li>
        <li>Edge 14 (release: 2/18/2016)</li>
        </ul>
        <h2 id="direct-access-recommended-">Direct Access (Recommended)</h2>
        <p>Access AVAT via <a href="https://aifarms.github.io/AVAT/">https://aifarms.github.io/AVAT/</a>.</p>
        <h2 id="local-deployment-frontend-">Local Deployment (Frontend)</h2>
        <p>These instructions will help you set up a local copy of the project for development and testing purposes.</p>
        <h3 id="prerequisites">Prerequisites</h3>
        <p>You will need to have npm, firefox/chrome, and git installed on your system.</p>
        <h3 id="installing-and-building">Installing and Building</h3>
        <ol>
        <li>Clone the repository to your desired location:
        ```bash
        git clone <a href="https://github.com/AIFARMS/AVAT">https://github.com/AIFARMS/AVAT</a></li>
        <li>Install the required node_modules:
        ```bash
        npm install</li>
        <li>Start the project locally. The website will be accessible at <a href="http://localhost:4000/">http://localhost:4000/</a>. This command starts the front-end portion of the dashboard:
        ```bash
        npm start</li>
        <li>To simply access the website, navigate to the build folder and open <code>index.html</code>.</li>
        </ol>
        <h2 id="key-bindings">Key Bindings</h2>
        <p>The platform has a series of built in key binds that allow the user to employ different sampling strategies. Skipping through frames is accomplished with “e” for forward and “q” for backward, while “w” toggles the pause/play function. The “c” key is particularly useful for copying the previous annotation, thereby reducing repetitive tasks when annotating sequences with minimal changes. The “f” key is used to toggle the scrub mode, which is activated by default to allow for quick navigation through the video timeline.</p>
        <ul>
        <li><code>e</code>: Skip forward to the next frame.</li>
        <li><code>q</code>: Skip backward to the previous frame.</li>
        <li><code>w</code>: Toggle pause/play for the video.</li>
        <li><code>c</code>: Copy the previous annotation, useful for sequences with minimal changes.</li>
        <li><code>f</code>: Toggle scrub mode for quick video timeline navigation.</li>
        <li><code>a</code>: Add a new annotation.</li>
        <li><code>r</code>: Remove the selected annotation.</li>
        </ul>
        <h2 id="user-interface">User Interface</h2>
        <h3 id="video-playback-and-annotation-area">Video Playback and Annotation Area</h3>
        <ul>
        <li>The user interface of the AVAT platform is divided into two main sections. The left section features the video playback area, where the media is displayed for annotation. This primary area is designed for clear visibility and interaction with the video content. On the right side of the video playback area, there is a structured annotation table. This table is organized to display a list of annotations corresponding to the video frames. Each entry in the table is associated with a specific annotation created within the video playback area. The table columns include details such as the local ID , the global ID(Glo), and descriptors such as posture, behavior, and a confidence score. There is also a deletion option (Del) for removing annotations as needed. The “Previous” tab allows users to visualize annotations from the previous frames. Above the video playback area, there is a navigation bar with options such as “Export” and “Instructions”, which contains functionality for data export and accessing user guidelines. The top right corner includes a frame indicator, showing the current frame out of the total number of frames, and playback control buttons like “Prev” for previous frame, “Play” for starting the video, and “Next” for advancing to the next frame of interest. On the right side of the navigation bar, there is an “Add” button, indicating a quick action to insert new annotations.</li>
        </ul>
        <h3 id="navigation-and-functionality">Navigation and Functionality</h3>
        <ul>
        <li>Above the video playback area, a navigation bar includes options for data export and accessing guidelines through the “Export” and “Instructions” tabs.</li>
        <li>A frame indicator in the top right corner displays the current frame number.</li>
        <li>Playback control buttons include “Prev” for the previous frame, “Play” for starting the video, and “Next” for advancing to the next frame.</li>
        <li>An “Add” button allows for quick insertion of new annotations.</li>
        </ul>
        <h2 id="media-upload-and-initialization">Media Upload and Initialization</h2>
        <h3 id="uploading-videos">Uploading Videos</h3>
        <ol>
        <li>Access the “Upload” tab to start.</li>
        <li>Select the media type to be annotated from the Format dropdown.</li>
        <li>Specify the number of video streams in the “Stream Number” field.</li>
        <li>Click “Browse” next to “Video Upload” and choose the file from the local directory.</li>
        <li>Pre-defined ethogram labels or existing annotations can be uploaded using the “Column Upload” and “Annotation Upload” buttons.</li>
        <li>Ensure the “Frame Rate” matches the video’s frame rate.</li>
        <li>Set the “Skip Value” to determine the frame sampling interval.</li>
        <li>Click “Upload” to process and display the first frame, indicating readiness for annotation.</li>
        </ol>
        <h3 id="uploading-images">Uploading Images</h3>
        <ul>
        <li>Ensure images are in a 16:9 aspect ratio for optimal performance.</li>
        </ul>
        <h3 id="initialization-workflow">Initialization workflow</h3>
        <ul>
        <li>Initiating the annotation platform starts with accessing the “Upload” tab. First, users select the type of media Format dropdown to denote the type of media to be annotated. Then, they specify the number of video streams for upload in the “Stream Number” field, inputting “1” for a single video. Users upload their video by clicking “Browse” next to “Video Upload” and choosing the file from their local directory. If there are pre-defined ethogram labels or existing annotations, these can be uploaded using the “Column Upload” and “Annotation Upload” buttons, respectively. The “Frame Rate” field should match the video’s frame rate to synchronize the annotations with the video. The “Skip Value” determines the frame sampling interval. A default value of “1” means every frame will be sampled; a higher value will skip frames and reduce the sampling frequency. After selecting the files and setting the parameters, users click the “Upload” button to start the upload process. The platform processes the videos or images, and upon completion, the first frame of the video is displayed in the playback area, indicating readiness to begin annotation work. This process is designed to be simple and efficient, ensuring users can quickly start annotating their videos with minimal setup.</li>
        </ul>
        <h2 id="annotation-types-and-process">Annotation Types and Process</h2>
        <ul>
        <li><strong>Behavior Annotation</strong>: For labeling behaviors or postures. Keybinds: <code>1</code> and <code>a</code>.</li>
        <li><strong>Bounding Box and Segmentation</strong>: For bounding boxes, users click and drag the mouse to draw a rectangle around the object of interest. Resizing is easily done by dragging the small squares at the corners of the bounding box. Each box is automatically assigned a number which links it to a corresponding entry in the table on the interface for easy tracking. For segmentation, users click to place points on the periphery of the object, which are then joined to form a polygon. Clicking on the first point closes and completes the shape. Should adjustments be required, selecting “Edit Segmentation” enables the editing mode, allowing users to move existing points for precise placement.</li>
        <li><strong>Upload a custom ethogram</strong>: To incorporate existing ethogram labels into the annotation process, users must modify the template file named data_column.json. This file acts as a template for the ethogram and posture labels within the system. Users can add or remove labels by editing this JSON file, which allows the system to display the customized ethogram for annotators. This step is essential for ensuring that behavior scoring and annotation processes align with the specific ethogram developed for the study.</li>
        </ul>
        <h2 id="customizing-the-ethogram-with-data_column-json-">Customizing the Ethogram with <code>data_column.json</code></h2>
        <p>To tailor the AVAT platform&#39;s annotation system to your study&#39;s specific needs, you&#39;ll need to modify the <code>data_column.json</code> template. This file dictates the structure of the annotation table and the options available in dropdown menus for annotating videos. Follow the steps below to customize this file.</p>
        <h3 id="step-1-accessing-the-template">Step 1: Accessing the Template</h3>
        <p>The template can be found at the AVAT GitHub repository: <a href="https://github.com/AIFARMS/AVAT/data_column.json">data_column.json</a>. Download or view this file to begin customization.</p>
        <h3 id="step-2-understanding-the-file-structure">Step 2: Understanding the File Structure</h3>
        <p>The <code>data_column.json</code> consists of two primary sections:</p>
        <ul>
        <li><code>columns</code>: Defines the headers and accessors for data columns in the annotation interface.</li>
        <li><code>select_data</code>: Specifies options for dropdown menus in the annotation tool, such as confidence levels, behaviors, and postures.</li>
        </ul>
        <h3 id="step-3-editing-the-file">Step 3: Editing the File</h3>
        <h2 id="annotation-workflow">Annotation Workflow</h2>
        <ol>
        <li><p><strong>Preparation</strong></p>
        <ul>
        <li>Before starting, ensure that your media files are ready for upload. This includes having videos in supported formats and images, if applicable, prepared in a 16:9 aspect ratio <code>.mp4</code> to ensure maximum compatibility with the AVAT platform.</li>
        </ul>
        </li>
        <li><p><strong>Uploading Media</strong></p>
        <ul>
        <li>Navigate to the “Upload” tab on the platform&#39;s interface.</li>
        <li>For videos, select the type of media to be annotated from the Format dropdown menu. Specify the number of video streams for upload in the “Stream Number” field.</li>
        <li>Click “Browse” next to “Video Upload” and select the file from your local directory. If you have predefined ethogram labels or existing annotations, use the “Column Upload” and “Annotation Upload” buttons to upload these files.</li>
        <li>Ensure the “Frame Rate” field matches the video’s frame rate for synchronization. Adjust the “Skip Value” to set the frame sampling interval according to your needs.</li>
        <li>Click “Upload” to initiate the processing of the videos or images. Once complete, the first frame of the video will be displayed in the playback area, indicating readiness for annotation.</li>
        </ul>
        </li>
        <li><p><strong>Starting the Annotation Process</strong></p>
        <ul>
        <li>Begin annotating the video by using the key binds to navigate through frames and manage annotations. You can switch between different annotation modes (e.g., behavior annotation, bounding box) as needed to accurately label the video content.</li>
        <li>For behavior annotations, use the <code>1</code> and <code>a</code> keys to add labels for behaviors or postures that don&#39;t have visual attributes.</li>
        <li>To create bounding boxes around objects of interest, switch to the bounding box mode with the <code>2</code> key and use the <code>a</code> key to add a new bounding box. Resize and position the box using your mouse, ensuring it accurately encompasses the object.</li>
        </ul>
        </li>
        <li><p><strong>Reviewing and Adjusting Annotations</strong></p>
        <ul>
        <li>Periodically review your annotations to ensure accuracy and completeness. Use the navigation controls and key bindings to revisit previous frames and adjust annotations as necessary.</li>
        <li>If you need to remove or edit an annotation, utilize the corresponding key bindings (<code>r</code> for removal, <code>e</code> and <code>q</code> for navigation) and mouse actions to make precise adjustments.</li>
        </ul>
        </li>
        <li><p><strong>Exporting Annotated Data</strong></p>
        <ul>
        <li>Once you have completed the annotation process, you can export your annotated data for further analysis or sharing with your team. Use the &quot;Export&quot; option in the navigation bar to save your work in the desired format.</li>
        </ul>
        </li>
        </ol>
        <h2 id="sampling-rate">Sampling rate</h2>
        <p>Ensure video frame rates are accurately inputted for synchronization. Adjust sampling values as needed for your project&#39;s requirements. 
        Given that manually labeling every image or frame of a video is an inefficient process, our system adopts an approach that requires users to annotate a sparse set of frames, also referred to as the sampling rate. The sampling rate is dependent on the research question, and we recommend two sampling rate methods: static sampling and dynamic sampling. </p>
        <p><code>Static sampling</code> is a simple strategy that aims to annotate animals on a static interval where the N intermediate frames are skipped. This strategy is perfect for videos where an set of ethogram labels has already been specified as the user is not looking out for odd or new behaviors that might occur. 
        For videos that have a lot of movement, we set N to be low, whereas, for videos that have small amounts of movement, we can set N to be higher. As such, the primary goal of the user is to minimize N such that key elements of the video are not left out by the skipped frames. Having N too low will result in the user wasting time annotating frames that could easily be interpolated and having a high N will result in key frames being skipped causing the user to comb through the individual frames manually, wasting time. 
        Assuming a suitable ethogram is provided, one can determine the N as the minimum time t it takes for a single event to happen between frames. Specifically, N would be set relative to the activity level of the animals in the video. For example, if the animals were extremely active and engaging in lots of social behaviors through the course of the video, N would be set low as it helps capture nuanced behaviors that would be missed with a high N. Likewise, if the animals were docile and not social, N would set high since not much activity would have happened between frames and the ethogram would only track behaviors that occur through the course of several frames.
        Functionally, static sampling involves asking the user for N. This value should be set at the start and should be manually set by the user at all times. We recommend a default value of 1 frame per second of video as a baseline N value. </p>
        <p><code>Dynamic sampling</code> is a strategy that aims to annotate animals for use in the creation of an ethogram. This strategy allows the user to decide when to annotate based on the happenings in the video. This allows the collection of new behaviors and adds the ability for the user to add notes about what is occurring for help in ethogram development. Since the choice of which frames to annotate is on the user, it adds variance in the results and time were taken to complete annotations. For a trained annotator, using dynamic sampling is beneficial since it allows for frames that are not of interest to be skipped in favor of more data-rich frames. However, this sampling strategy requires a seasoned annotator. Unskilled annotators are likely to be less efficient while employing a dynamic sampling strategy since they are not aware of which frames contain the most important features. We recommend using this strategy only if the user is a trained annotator. Functionally, dynamic sampling is implemented by a pause/play option and the ability to scrub through the video. Adding functionality such as playback speed significantly helps the user as they are able to skip through the irrelevant frames with ease. Allowing the user to control the frame level is key as some frames might have changes in between single frames. 
        The platform has a series of built in keybinds that allow the user to employ different sampling strategies. Skipping through frames is accomplished with “e” for forward and “q” for backward, while “w” toggles the pause/play function. The “c” key is particularly useful for copying the previous annotation, thereby reducing repetitive tasks when annotating sequences with minimal changes. The “f” key is used to toggle the scrub mode, which is activated by default to allow for quick navigation through the video timeline.</p>
        <h2 id="troubleshooting-and-feedback">Troubleshooting and Feedback</h2>
        <p>For any issues or feedback, please use the &quot;Report&quot; button in the top toolbar to submit a detailed report.</p>

        </div>
    )
}