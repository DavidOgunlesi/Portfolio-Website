import './styles.css';
import {useEffect, useState, useRef, useCallback} from 'react';
import quickNoise from 'quick-perlin-noise-js';
const FONTSIZE = 18;
const FONTWIDTH = 9.84615384615;

export function AsciiDisplay({
  cellFunction = defaultCellFunction,
  color = "#58729E",
  fps=60,
  doPerlin=false,
  fixedStrings=[],
  centerStringText='',
  centerStringPos={x:0, y:0},
  lineNumberCutOff=0,
}) {

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const timeRef = useRef(0);
  const time = timeRef.current;
  const offset = useRef(randomIntRange(1000,100000)).current;
  const resolution = 40;
  const fixedStringCoords = useRef([]).current;
  

  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);

  const div = useCallback(node => {
    if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
        setWidth(node.getBoundingClientRect().width);
    }
  }, [windowSize]);

  let h = height ? height : windowSize.innerHeight;
  let w = width ? width : windowSize.innerWidth;
  let numberOfLines = Math.floor(h / FONTSIZE) - lineNumberCutOff;
  let lineLength = Math.floor(w / FONTWIDTH);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    if (fixedStringCoords.length === 0) {
      fixedStringCoords.length = [];
      fixedStrings.forEach(string => {
        fixedStrings[fixedStrings.indexOf(string)] = ` ${string} `;
        let x = randomIntRange(0, lineLength - string.length);
        let y = randomIntRange(0, numberOfLines - 1);
        while (fixedStringCoords.some(coord => coord.x === x && coord.y === y)) {
          x = randomIntRange(0, lineLength - string.length*2);
          y = randomIntRange(0, numberOfLines - 1);
        }
        fixedStringCoords.push({x, y});
      });
    }
    
    const interval = setInterval(() => {
      timeRef.current += 1;
      setWindowSize(getWindowSize());
    }, 1000/fps);

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      clearInterval(interval);
    };
  }, []);

  let rows = [];
  for (let y = 0; y < numberOfLines; y++) {
    let values = "";
    for (let x = 0; x < lineLength; x++) {
      //time/140
      let centrex = lineLength/2;
      let centrey = numberOfLines/2;
      
      let data = cellFunction(centrex, centrey, x, y, time);
      let value = 1
      
      if (doPerlin) {
        value = quickNoise.noise((data.newX+centrex+offset)/resolution, (data.newY+centrey+offset)/resolution, 0);
      }
      let char = RangeToCustomAsciiCharacters(0,1,(value+1)/2," ,-~:;  =*#$@     ");
      
      if (char === undefined) {
        char = ' ';
      }
      values += char;
    }
    rows.push(values);
  }

  //Add fixed strings
  fixedStrings.forEach(string => {
    if (fixedStringCoords.length === 0) {
      return;
    }
    let {x, y} = fixedStringCoords[fixedStrings.indexOf(string)];
    let currStr = rows[y];
    if (currStr === undefined) {
      return;
    }
    //Replace all non-space characters with characters from the string
    let targStr = currStr.substring(x, x + string.length);
    let resStr = ""
    for (let i = 0; i < targStr.length; i++) {
      if (targStr[i] === " ") {
        resStr += " "
      }else{
        resStr += string[i];
      }
      
    }
    rows[y] = currStr.substring(0, x) + resStr + currStr.substring(x + string.length);
  });

  //Add center string
  if (centerStringText !== '') {
    let {x, y} = centerStringPos;
    let middleRowLengthOfString = centerStringText.split("\n")[Math.floor(centerStringText.split("\n").length / 2)].length;
    x = lineLength/2 + x - middleRowLengthOfString/2;
    y = Math.floor(numberOfLines/2 + y);
    
    let splitString = centerStringText.split('\n');
    //Replace all non-space characters with characters from the string
    for (let i = 0; i < splitString.length; i++) {
      let currLine = splitString[i];
      let currStr = rows[y + i];

      let targStr = currStr.substring(x, x + currLine.length);
      let resStr = ""
      for (let i = 0; i < targStr.length; i++) {
        if (targStr[i] === " " && doPerlin) {
          //Get number from ascii character
          resStr +=  ".";//`${offsetAsciiCharacters(currLine[i],i)}`;
        }else if (currLine[i] === " ") {
          resStr += targStr[i];
        }else{
          resStr += currLine[i];
        }
        
      }
      resStr = resStr.replaceAll(".", " ")
      rows[y+i] = currStr.substring(0, x) + resStr + currStr.substring(x + currLine.length);
    }
    // rows[y] = currStr.substring(0, x) + resStr + currStr.substring(x + string.length);
    // for (let i = 0; i < splitString.length; i++) {
    //   let currLine = splitString[i];
    //   let currStr = rows[y + i];
    //   rows[y + i] = currStr.substring(0, x) + currLine + currStr.substring(x + currLine.length);
    // }
  }
  
  let asciiRows = []
  for (let i = 0; i < rows.length; i++) {
    asciiRows.push(<div key={i}>{rows[i]}</div>);
  }
  return (
    <div className="ascii_display">
      {/* <div className="bg"></div> */}
      <div className="main" ref={div} style={{color: color}}>
        {asciiRows}
      </div>
      <div className="grid r"></div>
      <div className="grid g"></div>
      <div className="grid b"></div>
    </div>
  );
}

function defaultCellFunction(centrex, centrey, x, y, time) {
  return {newX: x, newY: y};
}

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

function RangeToCustomAsciiCharacters(min, max, value, asciiCharacters) {
  let range = max - min;
  let step = range / asciiCharacters.length;
  let index = Math.floor((value - min) / step);
  return asciiCharacters[index];
}

function randomIntRange(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}