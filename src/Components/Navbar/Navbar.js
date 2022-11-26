import './styles.css';
import {useEffect, useState, useRef} from 'react';
const FONTWIDTH = 9.84615384615;

export function Navbar(){
    const [windowSize, setWindowSize] = useState(getWindowSize());
    useEffect(() => {
        function handleWindowResize() {
          setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

    let lineLength = Math.floor(windowSize.innerWidth / FONTWIDTH);
return (

    <div className="navbar_container">
        <div className=''>
            {
            Array.from(Array(lineLength)).map((_, i) => {
                return <span key={i} className='navbar_char'>=</span>
            }
            , this)}
        </div>
        <div className="navbar">
            <div className="navbar_text">#Sandbox</div>  
            <div className="navbar_text">#Projects</div>  
            <div className="navbar_text">#Papers</div>
            <div className="navbar_text">#Design</div>   
            <div className="navbar_text">#About-me</div>  
        </div>
    </div>
    );
}

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }
