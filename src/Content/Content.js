import AsciiHRule from '../Components/AsciiHRule';
import './styles.css';
import AsciiCarousel from '../Components/AsciiCarousel';

export function Content(){
    return (
        <div className="content_container" id="#Sandbox">  
            <Heading text="Sandbox"/>
            <div className='horizontal_container'>
            <div className=''>
                
            </div>
            <AsciiCarousel images={[
                {caption: "Heart", imageURL: '/heart.jpg'}, 
                {caption: "Atom", imageURL:'/logo192.png'},
                ]}/>
            <div style={{textAlign: "right"}}>
                <p>Images speak a thousand words, interactive projects then...</p>
                <p>...speak a million.</p>
                <p>Most people are visual learners and most visualisations are
                    better than text. I'm a visual learner and an artist at heart
                    and I love to make visualisations. I'm also a developer and I 
                    love to make interactive visualisations. Play around with some 
                    with some of my sandbox projects at your own risk. They're
                    not always stable and they're not always pretty. But they're
                    always fun. 
                </p>
            </div>
            </div>
        </div>
    );
}

function Heading({text}){
    return (
        <>
            <AsciiHRule char="="/>
            <div className="title">
                <h1><span className="name">{text}</span></h1>
            </div>
            <AsciiHRule char="."/>
        </>
    );
}
