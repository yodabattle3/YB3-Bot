const apiKey = "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"; // Replace with your OpenAI key

const chatbox = document.getElementById("chatbox");

function appendMessage(text, sender) {
  const msgElem = document.createElement("div");
  msgElem.className = `message ${sender}`;
  msgElem.innerText = text;
  chatbox.appendChild(msgElem);
  msgElem.scrollIntoView({ behavior: "smooth" });
  saveToHistory(text, sender);
}

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const message = inputField.value;
  if (!message.trim()) return;

  appendMessage(message, "user");
  inputField.value = "";

  const response = await getAIResponse(message);
  appendMessage(response, "bot");
}

async function getAIResponse(prompt) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://yodabattle3.github.io/YB3-Bot/",
        "X-Title": "YB3_AI_HTML"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    console.log(data);
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else if (data.error && data.error.message) {
      return "API Error: " + data.error.message;
    } else {
      return "Unknown error from OpenAI.";
    }
  } catch (e) {
    return "Error contacting AI: " + e.message;
  }
}

function usePreset(prompt) {
  document.getElementById("userInput").value = prompt;
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("userInput").value = transcript;
  };
}

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("light-mode");
};

function saveToHistory(text, sender) {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push({ sender, text });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

window.onload = () => {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.forEach(msg => appendMessage(msg.text, msg.sender));
};
