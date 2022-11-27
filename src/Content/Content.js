import AsciiHRule from '../Components/AsciiHRule';
import './styles.css';
import AsciiCarousel from '../Components/AsciiCarousel';

export function Content(){
    return (
        <div className='content_main'>
        <div className="content_container" id="#Sandbox">  
            <Heading text="Sandbox"/>
            <div className='horizontal_container'>
                <AsciiCarousel images={[
                {caption: "Heart", imageURL: '/heart.jpg'}, 
                {caption: "Atom", imageURL:'/logo192.png'},
                ]}/>
                <div className='text_right' style={{textAlign: "right"}}>
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
        <div style={{height: "400px"}}/>
        <div className="content_container" id="#Projects">  
            <Heading text="Projects" style={{textAlign:"right"}}/>
            <div className='horizontal_container'>
                <div className='text_left'>
                    <p>I start a lot of projects. If every artist has a thousand bad drawings
                        before they can draw a good one, then I have a thousand bad projects
                        before I can make a good one. I'm not sure if that's true, but I'm
                        sure that I have a lot of bad projects. I'm also sure that I have
                        a lot of good projects. Though many projects lie somewhere in between; in 
                        the realm of the mediocre and the unfinished.

                    </p>
                    <p>Let's stick to the good projects.</p>
                </div>
                <AsciiCarousel images={[
                {caption: "Heart", imageURL: '/heart.jpg'}, 
                {caption: "Atom", imageURL:'/logo192.png'},
                ]}/>
            </div>
        </div>
        </div>
        
    );
}

function Heading({text, style = {}}){
    return (
        <>
            <AsciiHRule char="="/>
            <div className="title" style={style}>
                <h1><span className="name">{text}</span></h1>
            </div>
            <AsciiHRule char="."/>
        </>
    );
}
