import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥 FILL THIS OUT FIRST! 🔥
// 🔥 GET YOUR GEMINI API KEY AT 🔥
// 🔥 https://g.co/ai/idxGetGeminiKey 🔥
let API_KEY = 'AIzaSyCq-vREiIZioED3dBSM1EtreBRFgA0ihoU';

let form = document.getElementById('upload-form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  let fileInput = form.elements.namedItem('chosen-image').files[0];

  if (!fileInput) {
    output.textContent = 'Please upload an image file.';
    return;
  }

  try {
    // Read the image file as a base64 string
    let reader = new FileReader();
    reader.readAsDataURL(fileInput);
    reader.onloadend = async () => {
      let imageBase64 = reader.result.split(',')[1]; // Remove the data URL prefix

      // Assemble the prompt by combining the text with the chosen image
      let contents = [
        {
          role: 'user',
          parts: [
            { inline_data: { mime_type: fileInput.type, data: imageBase64 } },
            { text: promptInput.value }
          ]
        }
      ];

      // Call the gemini-pro-vision model, and get a stream of results
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-pro-vision",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      const result = await model.generateContentStream({ contents });

      // Read from the stream and interpret the output as markdown
      let buffer = [];
      let md = new MarkdownIt();
      for await (let response of result.stream) {
        buffer.push(response.text());
        output.innerHTML = md.render(buffer.join(''));
      }
    };
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};
// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);

// Add event listener to the file input
document.getElementById('file-input').addEventListener('change', (event) => {
  // Get the selected file
  const file = event.target.files[0];

  // Check if a file is selected
  if (file) {
    // Create a file reader
    const reader = new FileReader();

    // Set up the reader's onload event
    reader.onload = (e) => {
      // Set the image preview's source to the file's data URL
      document.getElementById('image-preview').src = e.target.result;

      // Display the image preview
      document.getElementById('image-preview').style.display = 'block';
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  } else {
    // Hide the image preview if no file is selected
    document.getElementById('image-preview').style.display = 'none';
  }
});
