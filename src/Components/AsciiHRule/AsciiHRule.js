import {useCallback, useEffect, useState} from 'react';

const FONTWIDTH = 9.84615384615;

export function AsciiHRule({char}) {
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const div = useCallback(node => {
    if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
        setWidth(node.getBoundingClientRect().width);
    }
    }, [refresh]);

    useEffect(() => {
        function handleWindowResize() {
            setRefresh(!refresh);
        }

        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, [refresh]);

    let lineLength = Math.floor(width / FONTWIDTH);
    return(
        <div ref={div}>
            {
            Array.from(Array(lineLength)).map((_, i) => {
                return <span key={i}>{char}</span>
            }
            , this)}
        </div>
    );
}

  