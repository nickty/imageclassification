import React, { useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadModel = async () => {
    const model = await mobilenet.load();
    return model;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const classifyImage = async () => {
    setLoading(true);
    const model = await loadModel();
    const imgElement = document.getElementById('uploadedImage');
    const predictions = await model.classify(imgElement);
    setPredictions(predictions);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Classification</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <div className="image-container">
              <img id="uploadedImage" src={image} alt="uploaded" />
              <button type="button" onClick={classifyImage}>
                Classify Image
              </button>
            </div>
          )}
        </form>
        {loading && <div className="spinner"></div>}
        {predictions.length > 0 && (
          <div className="predictions">
            <h2>Predictions</h2>
            <ul>
              {predictions.map((pred, index) => (
                <li key={index}>
                  {pred.className}: {pred.probability.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
