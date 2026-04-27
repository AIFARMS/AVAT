import React from "react";

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>
    {children}
  </section>
);

export default function Instructions(){
  return (
    <div className="space-y-5 text-sm leading-6 text-zinc-700 [&_a]:text-blue-600 [&_a]:underline [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc">
      <p>
        AVAT is a video annotation platform for identifying and tracking animals of interest across frames. The interface includes video playback, annotation tools, export options, and key bindings for efficient workflows.
      </p>

      <Section title="Browser Support">
        <p>Use the latest version of Chrome or Firefox when possible. AVAT has also supported Safari 10, Edge 14, Chrome 49, and Firefox 50.</p>
      </Section>

      <Section title="Access and Local Setup">
        <p>Access AVAT at <a href="https://aifarms.github.io/AVAT/">https://aifarms.github.io/AVAT/</a>.</p>
        <ol>
          <li>Clone the repository: <code>git clone https://github.com/AIFARMS/AVAT</code></li>
          <li>Install dependencies: <code>npm install</code></li>
          <li>Start the local app: <code>npm start</code></li>
          <li>Open the local URL shown in the terminal.</li>
        </ol>
      </Section>

      <Section title="Key Bindings">
        <ul>
          <li><code>e</code>: Skip forward to the next frame.</li>
          <li><code>q</code>: Skip backward to the previous frame.</li>
          <li><code>w</code>: Toggle pause/play for video.</li>
          <li><code>c</code>: Copy the previous annotation.</li>
          <li><code>f</code>: Toggle scrub mode for quick timeline navigation.</li>
          <li><code>a</code>: Add a new annotation.</li>
          <li><code>r</code>: Remove the selected annotation.</li>
        </ul>
      </Section>

      <Section title="User Interface">
        <p>
          The left side of the interface displays the media being annotated. The right side contains the annotation table, including local ID, global ID, descriptors such as posture and behavior, confidence score, and deletion controls.
        </p>
        <p>
          The top navigation provides export controls, instructions, frame status, playback controls, settings, and annotation actions.
        </p>
      </Section>

      <Section title="Uploading Media">
        <ol>
          <li>Open Settings or the upload dialog.</li>
          <li>Select the media format and stream count.</li>
          <li>Choose the video or image files to annotate.</li>
          <li>Optionally upload column or existing annotation files.</li>
          <li>Set frame rate and skip value to match the desired sampling rate.</li>
          <li>Click Upload to process the media and begin annotation.</li>
        </ol>
        <p>Images should use a 16:9 aspect ratio for best results.</p>
      </Section>

      <Section title="Annotation Types">
        <ul>
          <li><strong>Behavior Annotation:</strong> Label behaviors or postures using the behavior annotation mode.</li>
          <li><strong>Bounding Box:</strong> Draw and resize rectangles around objects of interest.</li>
          <li><strong>Segmentation:</strong> Place points around an object to create a polygon, then edit points as needed.</li>
          <li><strong>Custom Ethogram:</strong> Modify <code>data_column.json</code> to customize annotation columns and dropdown values.</li>
        </ul>
      </Section>

      <Section title="Sampling Rate">
        <p>
          Static sampling annotates frames at a fixed interval. Lower skip values capture more movement but require more annotation work. Higher skip values reduce workload but can miss important behavior changes.
        </p>
        <p>
          Dynamic sampling lets the annotator decide when to pause, scrub, and annotate based on events in the video. This is best for trained annotators creating or refining an ethogram.
        </p>
      </Section>

      <Section title="Troubleshooting and Feedback">
        <p>Use the Report button in the top toolbar to submit issues or feedback.</p>
      </Section>
    </div>
  )
}
