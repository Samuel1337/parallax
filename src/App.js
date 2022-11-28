import logo from './logo.svg';
import './App.css';
import Canvas from "./components/canvas/canvas";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Canvas size="12px 24px" />
        <p>
          <code>Parallax</code> testing.
        </p>
      </header>
    </div>
  );
}

export default App;


