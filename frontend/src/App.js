import logo from './logo.svg';
import './App.css';
import Canvas from "./components/canvas/canvas";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Canvas />
        <p>
          <code>Parallax</code> testing.
        </p>
      </header>
    </div>
  );
}

export default App;


