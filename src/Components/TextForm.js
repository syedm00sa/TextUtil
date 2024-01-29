import React, {useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';

export default function TextForm(props) {

  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(new SpeechSynthesisUtterance(''));
  const [text, setText] = useState('');
  const [grammar, setGrammar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voice, setVoice] = useState(false);

  useEffect(() => {
     
    const synth = window.speechSynthesis;
    utterance.text = text;
    if (voice) {
      utterance.voice = voice; 
    }
    return () => {
      synth.cancel();
    };
  }, [text, utterance, voice]);

  // useEffect(() => {
  //   const synth = window.speechSynthesis;
  // 
  //   const handleVoicesChanged = () => {
  //     const voices = window.speechSynthesis.getVoices();
  //     if (voices.length > 0) {
  //       setVoice(voices[0]);
  //     }
  //   };
  // 
  //   window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
  //   handleVoicesChanged(); // Call once to set initial voice
  // 
  //   return () => {
  //     window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  //     synth.cancel(); // Cancel any ongoing speech when the component is unmounted
  //   };
  // }, []);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else {
      synth.cancel(); // Stop any ongoing speech
      synth.speak(utterance);
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPaused(true);
  };

  const getDifferentVoice = () => {
    const synth = window.speechSynthesis.getVoices();
    const selectedVoice = synth.find((voice) => voice.name === 'Your Desired Voice Name');
  
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      setVoice(selectedVoice);
      props.showAlert('Voice changed successfully!', 'success');
    } else {
      props.showAlert('Desired voice not found!', 'danger');
    }
  };

  const handleUpClick = ()=> {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to uppercase!","success")

  }

  const handleLowClick = ()=> {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to lowercase!","success")
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  const handleEnClick = () => {
  try{  
      let encryptedText = btoa(text);
      setText(encryptedText);
      props.showAlert("Converted to encrypted!","success")
  }catch(error){
    props.showAlert("Check your given value","danger")
  }
  };

  const handleDeClick = () => {
    try{
        const decryptText = atob(text);
        setText(decryptText);
        props.showAlert("Converted to decrypted!","success")
    }catch(error){
      props.showAlert("Check your given value","danger")
    }
  };

  const handleClear = () => {
    setText('');
    setGrammar(null); 
    resetTranscript();
    props.showAlert("Text Cleared!","success")  
  };

  const handleCopy = () => {
    // let text = document.getElementById('myBox');
    navigator.clipboard.writeText(text);
    // document.getSelection().removeAllRanges();
    props.showAlert("Copied to Clipboard!","success")  
  }

  const handleExtraSpace = () => {
    let nextText = text.split(/^\s*|\s*$/gm);
    setText(nextText.join(" "));
    props.showAlert("Extra spaces removed!","success")  
  }

  // const Dictaphone = () => {
  //   const {
  //     transcript,
  //     listening,
  //     resetTranscript,
  //     browserSupportsSpeechRecognition
  //   } = useSpeechRecognition();
  
  //   if (!browserSupportsSpeechRecognition) {
  //     return <span>Browser doesn't support speech recognition.</span>;
  //   }
  // }

  const {
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  const handleStartListening = () => {
    SpeechRecognition.startListening(); 
  };

  const handleStopListening = () => {
    setText(transcript);  // Update the text state with the transcript
    SpeechRecognition.stopListening();
  };

  const handleResetTranscript = () => {
    resetTranscript();
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result.replace(/�/g,' ');  // Replace unwanted symbols
      setText(fileContent);
      setIsModalOpen(false);
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'text/plain, .txt',
  });

  // const handleGrammarCheck = async () => {
  //   try {
  //     const response = await fetch('https://api.languagetool.org/v2/check', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: `text=${encodeURIComponent(text)}&language=en-US`,
  //     });

  //     const data = await response.json();
  //     if (data.matches && data.matches.length > 0) {
  //       // Handle grammar mistakes
  //       const mistakes = data.matches.map((match) => match.message).join(', ');
  //       setGrammar(`Grammar mistakes found: ${mistakes}`);
  //     } else {
  //       props.showAlert('No grammar mistakes found!', 'success');
  //     }
  //   } catch (error) {
  //     props.showAlert('Error checking grammar', 'danger');
  //   }
  // };

  return (
    <>
    <div className='container' style={{color:props.mode==='dark'?'white':'#042743'}}>
      <h1>{props.heading} </h1>
      <div className="mb-3">
            <textarea className="form-control" value={text || transcript} onChange={handleOnChange} style={{backgroundColor:props.mode==='dark'?'#13466e':'white',
          color:props.mode==='dark'?'white':'black'}} id="myBox" rows="8"></textarea>
            <button disabled={text.length===0} className='btn btn-primary my-2'onClick={handleUpClick}>Convert to Uppercase</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleLowClick}>Convert to Lowercase</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleEnClick}>Convert to Encrypt Base64</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleDeClick}>Convert to Decrypt Base64</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
            <button className='btn btn-primary my-2 mx-1' onClick={handlePause} disabled={isPaused || text.length===0}>Pause</button>
            {/* <button disabled={text.length===0} className='btn btn-primary my-3 mx-1' onClick={getDifferentVoice}>Change voice</button> */}
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleExtraSpace}>Remove Extra Space</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleCopy}>Copy</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleStartListening}>Start listening</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleStopListening}>Stop listening</button>
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1' onClick={handleStopListening}>Stop listening</button>
            <button disabled={text.length===0} className="btn btn-primary my-2 mx-1" onClick={() => setIsModalOpen(true)}>
            Import File
          </button>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
            <div {...getRootProps()} style={{ cursor: 'pointer' }}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop a file here, or click to select a file</p>
            </div>
          </Modal>
            {/* <button disabled={text.length===0} className='btn btn-primary my-3 mx-1' onClick={handleResetTranscript}>Reset</button>
            <button disabled={text.length===0} className='btn btn-primary my-3 mx-1' onClick={resetTranscript}>Reset</button> */}
            {/* <button disabled={text.length===0} className="btn btn-primary my-3 mx-1" onClick={handleGrammarCheck}>Check Grammar</button> */}
            <button disabled={text.length===0} className='btn btn-primary my-2 mx-1'onClick={handleClear}>Clear</button>
      </div>
    </div>
    <div className="container" style={{color:props.mode==='dark'?'white':'#042743'}}>
      <h2>Your text summary</h2>
      <p>{text.trim() === '' ? 0 : text.trim().split(/\s+/).length} words and {text.trim().length} charaters</p>
      <p>{text.trim() === ''? 0.00 : (0.008 * text.trim().split(" ").length).toFixed(2)} Minutes to read</p>
    </div>
    </>
  )
}