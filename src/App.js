import { useState } from 'react';
import './App.css';
import AsciiDisplay from './Components/AsciiDisplay';
import { Navbar } from './Components/Navbar/Navbar';
import Sandbox from './Content';
import splashTextString from './Text/splashtext.txt';
function App() {
  const [splashText, setSplashText] = useState("")
  let max = 4;
  let min = 0
  let spiralCenter = Math.max(Math.floor(Math.random() * (max - min + 1)) + min, 1);

  fetch(splashTextString)
  .then(r => r.text())
  .then(text => {
    setSplashText(text);
  });

  const cellFunction = (centrex, centrey, x, y, time) => {
    x/=2;
    centrex/=spiralCenter
    let timeOffset = 500;//background-color: #3e4451;
    let maxSpiralSpeed = 10;
    let spiralSpeed = 4;//(time+timeOffset)/(100*Math.sin(time/cycleSpeed))
    //Rotate the grid from centre
    let distanceFromCenter = Math.sqrt(Math.pow(x - centrex, 2) + Math.pow(y - centrey, 2));
    time += timeOffset;
    time *= Math.min((spiralSpeed)/(distanceFromCenter), maxSpiralSpeed);
    let cx = x - centrex;
    let cy = y - centrey;
    let newX = cx * Math.cos(time/100) - cy * Math.sin(time/100);
    let newY = cx * Math.sin(time/100) + cy * Math.cos(time/100);

    newY+=centrey;
    newX+=centrex;

    // In case there is an error defualt to input coords
    if (isNaN(newX) || isNaN(newY)){
      newX = x;
      newY = y;
    }
    return {newX: newX, newY: newY};
  }
  

  return (

    <div className='App'>
      <div className='Background'></div>
      <AsciiDisplay
        doPerlin
        fixedStrings={[
          '\\davidogunlesi.com', '\\Artist','\\Problem Solver', '\\Software Engineer', 
          '\\Web Developer', '\\Student', '\\Learner', '\\Creator']}

        centerStringText={splashText}
        centerStringPos={{x: 0, y: 0}}
        fps={600}
        lineNumberCutOff={6}
        cellFunction = {cellFunction}
      />
      <AsciiDisplay
      lineNumberCutOff={6}
      color = "white"
      centerStringText={splashText}
      centerStringPos={{x: 0, y: 0}}
      />
      <Navbar/>
      <Sandbox/>
    </div>
  );
}


export default App;
