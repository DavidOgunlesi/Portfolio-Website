import { useState, useEffect } from "react";
import AsciiHRule from '../AsciiHRule';
import "./styles.css";

export function AsciiCarousel({images}){
    const [imagesLoadedCount, setImageLoadedCount] = useState(0);
    const [asciiJSXs, setAsciiJSXs] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            
            if (currentImage < images.length-1){
                setCurrentImage(currentImage + 1);
            } else {
                setCurrentImage(0);
            }
        }, 5000);
    
        return () => {
          clearInterval(interval);
        };
      }, [currentImage]);


    if (imagesLoadedCount == 0) {
        // Load images and convert to ascii
        images.forEach(image => {
            CovertImageToAsciiString(image.imageURL).then((data) => {

                let jsx = AsciiToJSX(data.asciiString, data.w, data.h);
                setAsciiJSXs(asciiJSXs => [...asciiJSXs, jsx]);
                setImageLoadedCount(imagesLoadedCount + 1);
            });
        });
    }

    const AsciiToJSX = (asciiString, wd, ht) => {
        let rows = [];
        let imageSize = {w:wd, h:ht};
        let imageScale = 60/imageSize.w;
        let w = Math.floor(imageSize.w*imageScale);
        let h = Math.floor(imageSize.h*imageScale);
        w = closestDivisibleNumber(60, imageSize.w);
        h = closestDivisibleNumber(60, imageSize.h);
        
        //Sample points in array based on scale
        let samplePoints = "";
        let jump = Math.floor(1 / (w/imageSize.w));
        
        for (let x = 0; x < imageSize.w; x += jump) {
            for (let y = 0; y < imageSize.h; y += jump) {
                samplePoints += asciiString[y + x * imageSize.w];
            }
        }
        
        //Convert ascii string to array of divs
        for (let y = 0; y < h; y++) {
            let row = [];
            for (let x = 0; x < w; x++) {
                row.push(samplePoints[x + y * w]);
            }
            rows.push(<div key={y}>{row}</div>);
        }
        return rows;
    }

    return (
        <div className="ascii_carosel">
            <div className="ascii_carosel_image_container">
            <div className="ascii_carosel_image">
                {asciiJSXs[currentImage]}
            </div>
            </div>
            <div className="ascii_carosel_controls">
                <div  className="ascii_carosel_caption">{images[currentImage].caption}</div>
                <div className="ascii_carosel_info">
                    [{
                    images.map((image, i) => {
                        let style = i == currentImage ? "control_btn_active" : "control_btn";
                        return <div className={style} key={i} onClick={() => setCurrentImage(i)}></div>
                    })
                }]
                </div>
            </div>
            <AsciiHRule char="="/>
        </div>
    );
}

async function CovertImageToAsciiString(imageURL){
    let image = new Image();
    image.src = imageURL;
    return new Promise((resolve, reject) => {
        image.onload = () =>{
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let w = image.width;
            let h = image.height;
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(image, 0, 0, w, h);
            let imageData = ctx.getImageData(0, 0, w, h);
            let data = imageData.data;
            let asciiString = "";
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                let brightness = (r + g + b) / 3;
                asciiString += GetAsciiChar(brightness);
            }

            resolve({w, h, asciiString});
        }
    });
    
}

function GetAsciiChar(brightness){
    let asciiChars = " .:-=+*#%@";
    let index = Math.floor(brightness / 255 * (asciiChars.length - 1));
    return asciiChars[index];
}

function closestDivisibleNumber(n, m){
    let i = m / n;
    let decimalPart = i - Math.floor(i);
    return Math.round(n - (n * decimalPart));


}