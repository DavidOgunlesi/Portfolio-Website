import './styles.css';
import {useEffect, useState, useRef, useCallback} from 'react';
import quickNoise from 'quick-perlin-noise-js';
const FONTSIZE = 18;
const FONTWIDTH = 9.84615384615;

export function AsciiDisplay({
  cellFunction = defaultCellFunction,
  color = "#00cdd5",
  fps=60,
  doPerlin=false,
  fixedStrings=[],
  centerStringText='',
  centerStringPos={x:0, y:0},
  lineNumberCutOff=0,
  imageSample: imageSampleURL,
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
    if (fixedStringCoords.length == 0) {
      fixedStringCoords.length = [];
      fixedStrings.forEach(string => {
        fixedStrings[fixedStrings.indexOf(string)] = ` ${string} `;
        let x = randomIntRange(0, lineLength - string.length);
        let y = randomIntRange(0, numberOfLines - 1);
        while (fixedStringCoords.some(coord => coord.x == x && coord.y == y)) {
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
  let img = null;
  if (imageSampleURL) {
    loadImage(imageSampleURL).then(image => {img = image;}).catch(err => {

    });
  }

  let rows = [];

  if (img || !imageSampleURL) {
    for (let y = 0; y < numberOfLines; y++) {
      let values = "";
      for (let x = 0; x < lineLength; x++) {
        //time/140
        let centrex = lineLength/2;
        let centrey = numberOfLines/2;
        
        let data = cellFunction(centrex, centrey, x, y, time);
        var value = 1
        if (doPerlin) {
          value = quickNoise.noise((data.newX+centrex+offset)/resolution, (data.newY+centrey+offset)/resolution, 0);
        }else if (imageSampleURL) {
          
          value = GetImagePixelData(img)[data.newY][data.newX];
        }

        let char = RangeToCustomAsciiCharacters(0,1,(value+1)/2," ,-~:;  =*#$@     ");
        if (char == undefined) {
          char = ' ';
        }
        values += char;
      }
      rows.push(values);
    }
  
    //Add fixed strings
    fixedStrings.forEach(string => {
      if (fixedStringCoords.length == 0) {
        return;
      }
      let {x, y} = fixedStringCoords[fixedStrings.indexOf(string)];
      let currStr = rows[y];
      if (currStr == undefined) {
        return;
      }
      //Replace all non-space characters with characters from the string
      let targStr = currStr.substring(x, x + string.length);
      let resStr = ""
      for (let i = 0; i < targStr.length; i++) {
        if (targStr[i] == " ") {
          resStr += " "
        }else{
          resStr += string[i];
        }
        
      }
      rows[y] = currStr.substring(0, x) + resStr + currStr.substring(x + string.length);
    });

    //Add center string
    if (centerStringText != '') {
      let {x, y} = centerStringPos;
      let middleRowLengthOfString = centerStringText.split("\\n")[Math.floor(centerStringText.split("\\n").length / 2)];
      x = lineLength/2 + x - middleRowLengthOfString.length/2;
      y = Math.floor(numberOfLines/2 + y);
      let str = replaceAll(centerStringText, "\\s", " ");
      
      let splitString = str.split('\\n');
      for (let i = 0; i < splitString.length; i++) {
        let currLine = splitString[i];
        let currStr = rows[y + i];
        rows[y + i] = currStr.substring(0, x) + currLine + currStr.substring(x + currLine.length);
      }
    }
  }
  let asciiRows = []
  for (let i = 0; i < rows.length; i++) {
    asciiRows.push(<div key={i}>{rows[i]}</div>);
  }

  return (
    <div className="main" ref={div} style={{color: color}}>
      {asciiRows}
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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function loadImage(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.src = src;
    img.onload = () => resolve(img);
    
  })  
}

function GetImagePixelData(img)
{
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  // wait for the image to load
  var pixelData = [];
  // draw the image on the canvas
  ctx.drawImage(img, 0, 0);
  // get the image data
  var imageData = ctx.getImageData(0, 0, img.width, img.height);
  // get the pixel data from the image data
  var data = imageData.data;
  // loop over all the pixels
  var pixelData = [];
  for (var i = 0; i < data.length; i += 4) {
    // convert the rgba values to a single value
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    var a = data[i + 3];
    var brightness = (3 * r + 4 * g + b) >>> 3;
    pixelData.push(brightness);
  }
  // Convert pixel data to 2d array
  var pixelData2d = [];
  for (var i = 0; i < img.height; i++) {
    pixelData2d.push(pixelData.slice(i * img.width, (i + 1) * img.width));
  }
  return pixelData2d;
}