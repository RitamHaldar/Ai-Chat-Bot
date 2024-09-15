import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  function formatAnswer(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\*\s(.*?)(?=\n\*\s|$)/g, '<p>→ $1</p>')
      .replace(/\*\*\s*(.*?)\n/g, '<h2>$1</h2>')
      .replace(/\n/g, '<br>')
      .replace(/😊/g, '😊')
      .replace(/😎/g, '😎')
      .replace(/😍/g, '😍');
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question.");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: `You are a cultural heritage assistant for an organization called Heritage Explorers. Answer the following question about cultural traditions, historical sites, and heritage landmarks, and include details about local customs, festivals, and historical significance if applicable and provide informating regarding india only. Format the response in a friendly, conversational tone with emojis. If the question is not related to culture or heritage, politely decline to answer. Question: ${value}`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();

      const formattedData = formatAnswer(data);

      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        { role: "user", parts: [value] },
        { role: "model", parts: [formattedData] }
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  let getres = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      let recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      const startBtn = document.getElementById('start-recognition');

      startBtn.addEventListener('click', () => {
        recognition.start();
      });

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setValue(speechToText);
      };

      recognition.onerror = (event) => {
        setValue(`Error occurred in recognition: ${event.error}`);
      };

      recognition.onend = () => {
        console.log('Speech recognition has stopped.');
      };
    } else {
      alert('Speech Recognition API is not supported in your browser.');
    }
  };


  return (
    <div className="app">
      <h2>ASSISTANT</h2>
      <div className="input-container">
        <input value={value} type="text" placeholder="    Enter your question" onChange={(e) => setValue(e.target.value)} />
        <button id="start-recognition" onClick={getres}><i class="fa-solid fa-microphone"></i></button>
        {!error && <button className="send" onClick={getResponse}><i class="fa-solid fa-circle-arrow-right"></i></button>}
        {error && <button class="send" onClick={clear}><i class="fa-solid fa-rotate-right"></i></button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index} style={{ margin: '5px 0' }}>
            <p
              className="answer"
              style={{
                backgroundColor: chatItem.role === "user" ? 'transparent' : 'transparent',
                padding: '10px',
                borderRadius: '1rem',
                margin: 0
              }}
            >
              <strong>
                {chatItem.role === "user" ?
                  <i
                    className="fa-solid fa-user-large"
                    style={{ marginRight: '8px', fontSize: '1.5em' }}
                  ></i> :
                  <i
                    className="fa-solid fa-robot"
                    style={{ marginRight: '8px', fontSize: '1.5em' }}
                  ></i>
                }
              </strong>
              <span dangerouslySetInnerHTML={{ __html: chatItem.parts.join(' ') }} />
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;


