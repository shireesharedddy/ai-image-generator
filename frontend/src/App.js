// src/App.js
import './App.css';
import ImageGenerator from './Components/ImageGenerator/ImageGenerator';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

  return (
    <div>
      <ImageGenerator apiUrl={API_URL} />
    </div>
  );
}

export default App;
