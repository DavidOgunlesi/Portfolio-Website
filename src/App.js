import logo from './logo.svg';
import './App.css';
import AsciiDisplay from './Components/AsciiDisplay';
import { Navbar } from './Components/Navbar/Navbar';

function App() {
  return (
    <div className='App'>
      <div className='Background'></div>
      <AsciiDisplay
      doPerlin
      fixedStrings={[
        '\\davidogunlesi.com', '\\Arist','\\Problem Solver', '\\Software Engineer', 
        '\\Web Developer', '\\Student', '\\Learner', '\\Creator']}

      centerStringText="\s____\s\s\s\s\s\s\s\s\s\s\s\s\s\s_\s\s\s\s\s_\s\s\s\s___\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s_\s\s\s\s\s\s\s\s\s\s\s_\s\n|\s\s_\s\\s\s__\s___\s\s\s_(_)\s__|\s|\s\s/\s_\s\\s\s__\s_\s_\s\s\s_\s_\s__\s|\s|\s___\s\s___(_)\n|\s|\s|\s|/\s_`\s\\s\\s/\s/\s|/\s_`\s|\s|\s|\s|\s|/\s_`\s|\s|\s|\s|\s'_\s\|\s|/\s_\s\/\s__|\s|\n|\s|_|\s|\s(_|\s|\\sV\s/|\s|\s(_|\s|\s|\s|_|\s|\s(_|\s|\s|_|\s|\s|\s|\s|\s|\s\s__/\__\s\\s|\n|____/\s\__,_|\s\_/\s|_|\__,_|\s\s\___/\s\__,\s|\__,_|_|\s|_|_|\___||___/_|\n\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s|___/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\n"
      centerStringPos={{x: +10, y: 0}}
      fps={600}
      lineNumberCutOff={6}
      cellFunction = {(centrex, centrey, x, y, time) => {
        let timeOffset = 500;
        let maxSpiralSpeed = 10;
        let cycleSpeed = 100;
        let spiralSpeed = 4;//(time+timeOffset)/(100*Math.sin(time/cycleSpeed))
        //Rotate the grid from centre
        let distanceFromCenter = Math.sqrt(Math.pow(x - centrex, 2) + Math.pow(y - centrey, 2));
        time += timeOffset;
        time *= Math.min((spiralSpeed)/distanceFromCenter, maxSpiralSpeed);
        let cx = x - centrex;
        let cy = y - centrey;
        let newX = cx * Math.cos(time/100) - cy * Math.sin(time/100);
        let newY = cx * Math.sin(time/100) + cy * Math.cos(time/100);
        newY+=centrey;
        newX+=centrex;
        return {newX, newY};
      }}
      />
      <AsciiDisplay
      lineNumberCutOff={6}
      color = "white"
      centerStringText="\s____\s\s\s\s\s\s\s\s\s\s\s\s\s\s_\s\s\s\s\s_\s\s\s\s___\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s_\s\s\s\s\s\s\s\s\s\s\s_\s\n|\s\s_\s\\s\s__\s___\s\s\s_(_)\s__|\s|\s\s/\s_\s\\s\s__\s_\s_\s\s\s_\s_\s__\s|\s|\s___\s\s___(_)\n|\s|\s|\s|/\s_`\s\\s\\s/\s/\s|/\s_`\s|\s|\s|\s|\s|/\s_`\s|\s|\s|\s|\s'_\s\|\s|/\s_\s\/\s__|\s|\n|\s|_|\s|\s(_|\s|\\sV\s/|\s|\s(_|\s|\s|\s|_|\s|\s(_|\s|\s|_|\s|\s|\s|\s|\s|\s\s__/\__\s\\s|\n|____/\s\__,_|\s\_/\s|_|\__,_|\s\s\___/\s\__,\s|\__,_|_|\s|_|_|\___||___/_|\n\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s|___/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\n"
      centerStringPos={{x: +10, y: 0}}
      />
      <Navbar/>
    </div>
  );
}


export default App;
