// Select dropdown containers and language dropdowns
const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

// Function to populate dropdowns with language options
function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = ""; // Clear existing options
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")"; // Display name and native language
    li.innerHTML = title;
    li.dataset.value = option.code; // Set data value for the option
    li.classList.add("option"); // Add option class
    dropdown.querySelector("ul").appendChild(li); // Append option to dropdown
  });
}

// Populate both input and output language dropdowns with the available languages
populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

// Event listeners for dropdown interactions
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active"); // Toggle dropdown visibility
  });

  // Set up event listeners for each language option
  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      // Remove active class from other options
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active"); // Mark selected option as active
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML; // Update displayed selected option
      selected.dataset.value = item.dataset.value; // Update selected value
      translate(); // Trigger translation on selection
    });
  });
});

// Close dropdown if click occurs outside
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active"); // Remove active class if clicked outside
    }
  });
});

// Setup for the swap button functionality
const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

// Event listener for swapping input and output languages
swapBtn.addEventListener("click", (e) => {
  // Swap selected language display
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  // Swap the dataset values for languages
  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  // Swap the text in the input and output areas
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate(); // Trigger translation after swap
});

// Function to perform translation
function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage =
    inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;

  // Check if input text is empty
  if (!inputText) {
    alert("Please enter text to translate."); // Alert user if no input
    return;
  }

  // Construct the URL for the translation API
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    inputText
  )}`;

  // Fetch translation from the API
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok"); // Handle network errors
      }
      return response.json(); // Parse JSON response
    })
    .then((json) => {
      if (json && json[0]) {
        outputTextElem.value = json[0].map((item) => item[0]).join(""); // Display translated text
      } else {
        alert("No translation found."); // Alert if no translation is returned
      }
    })
    .catch((error) => {
      console.error("Translation Error:", error); // Log any errors
      alert("An error occurred while translating. Please try again."); // Alert user on error
    });
}

// Event listener for input text to limit characters
inputTextElem.addEventListener("input", (e) => {
  // Limit input to 5000 characters
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000); // Trim to max length
  }
  translate(); // Automatically translate as user types
});

// Setup for file upload functionality
const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

// Event listener for document upload
uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  // Check for valid file types
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name; // Display uploaded file name
    const reader = new FileReader();
    reader.readAsText(file); // Read file as text
    reader.onload = (e) => {
      inputTextElem.value = e.target.result; // Set file content to input area
      translate(); // Translate uploaded content
    };
  } else {
    alert("Please upload a valid file"); // Alert for invalid file type
  }
});

// Setup for download button functionality
const downloadBtn = document.querySelector("#download-btn");

// Event listener for download button
downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" }); // Create a Blob for the text
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`; // Set download file name
    a.href = url;
    a.click(); // Trigger download
  }
});

// Setup for dark mode toggle
const darkModeCheckbox = document.getElementById("dark-mode-btn");

// Event listener for dark mode toggle
darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark"); // Toggle dark mode class
});

// Display character count for input text
const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length; // Update character count display
});

// Speech-to-Text Integration
const startSpeechRecognitionButton = document.getElementById(
  "start-speech-recognition"
);

// Function to start speech recognition
function startSpeechRecognition() {
  const recognition = new (window.SpeechRecognition ||
    window.webkit.SpeechRecognition)(); // Create recognition instance

  recognition.onstart = () => {
    console.log("Speech recognition started"); // Log start
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // Get recognized text
    inputTextElem.value = transcript; // Set recognized text in input
    translate(); // Translate after recognition
  };

  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error); // Log recognition errors
    alert("Error occurred in recognition: " + event.error); // Alert user
  };

  recognition.onend = () => {
    console.log("Speech recognition ended"); // Log end
  };

  recognition.start(); // Start recognition
}

// Event listener for speech recognition button
startSpeechRecognitionButton.addEventListener("click", startSpeechRecognition);
