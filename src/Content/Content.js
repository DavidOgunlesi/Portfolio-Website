import AsciiHRule from '../Components/AsciiHRule';
import './styles.css';
import AsciiCarousel from '../Components/AsciiCarousel';
import Markdown from 'react-markdown'
import { useEffect, useState } from 'react';

export function Content(){
    const [update, setUpdate] = useState(false);
    const [files, setFiles] = useState([]);
    const [activeTags, setActiveTags] = useState([]);

    const addRemoveTag = (tag) => {
        if (activeTags.includes(tag)) {
            var index = activeTags.indexOf(tag);
            activeTags.splice(index, 1);
            setActiveTags(activeTags);
            console.log(activeTags);
            return;
        }
        activeTags.push(tag);
        setActiveTags(activeTags);
        console.log(activeTags);
    }

    const get_text_file = async (filepath) => {
        // prefix public dir files with `process.env.PUBLIC_URL`
        // see https://create-react-app.dev/docs/using-the-public-folder/
        const res = await fetch(`${process.env.PUBLIC_URL}/${filepath}`);
        // check for errors
        if (!res.ok) {
          throw res;
        }
        return res.text();
      };

    const filePaths = require.context('../../public/markdown/projects', true, /\.md$/).keys();
    useEffect(() => {
        var newFiles = [];
        filePaths.map(file => {
            get_text_file(`markdown/projects${file.slice(1)}`).then((text)=>{
                if (newFiles.includes(text)) return;
                newFiles.push(text);
                setFiles(newFiles);
            }).catch(console.error);
            });
      }, []);


      const getProperty = (text, property) => {
        text = text.split('--?');
        text = text.slice(1, text.length-1);
        var text = text[0].split('\n');
        var fitered = text.filter((line) => {
            return line.includes(property);
        });
        var prop = fitered[0] ?? '';
        return prop.split(':')[1].trim();
      };

      const createTags = () => {
        const tagGroups = {};
        files.map((file) => {
            var tags = JSON.parse(getProperty(file, 'tags'));
            tags.map((tag) => {
                if (tagGroups[tag]) {
                    tagGroups[tag].count = tagGroups[tag].count += 1;
                }else{
                    tagGroups[tag] = {label: tag, count: 1}
                }
            });
        })
        
        var elements = []
        Object.keys(tagGroups).forEach(function(key, index) {
            elements.push(
                <div className={activeTags.includes(key) ? 'filter active' : 'filter'} key={index} onPointerDown={() => 
                {
                    // setActiveTag(key)
                    addRemoveTag(key);
                    setUpdate(!update);
                }}>
                    <div className='label'>#{tagGroups[key].label}</div>
                    <div className='number'>{tagGroups[key].count}</div>
                </div>
            );
        });
        return elements;
      }

      function findCommonElement(array1, array2) { 
  
        // Loop for array1 
        for (let i = 0; i < array1.length; i++) { 
      
            // Loop for array2 
            for (let j = 0; j < array2.length; j++) { 
      
                // Compare the element of each and 
                // every element from both of the 
                // arrays 
                if (array1[i] === array2[j]) { 
      
                    // Return if common element found 
                    return true; 
                } 
            } 
        } 
      
        // Return if no common element exist 
        return false; 
    } 

      const displayProjects = (activeTags) => {
        console.log("!");
        var elements = []
        files.map((file, index) => {
            var title = getProperty(file, 'title');
            var tags = JSON.parse(getProperty(file, 'tags'));
            var desc = getProperty(file, 'description');
            var date = getProperty(file, 'date');
            var image = getProperty(file, 'image');
            image = image.replaceAll('"', '');
            /*get image*/
            if (findCommonElement(tags, activeTags)) {
                elements.push(
                    <div className='project_display' key={title}>
                        <div className='wipe'></div>
                        <div className='info'>
                            <div className='project_title'>{title}</div>
                            <div className='tags'>{tags.join(", ")}</div>
                            <div className='description'>{desc}</div>
                            <div className='date'>{date}</div>
                        </div>
                        <img src={image}/>
                    </div>
                );
            }
        });
        return (<div className='vertical_container' style={{gap: 50}}>{elements}</div>);
      }

    return (
        <div>
            {/* <div className="content_container" id="#Sandbox">  
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
            </div> */}
            {/* <Markdown>{file}</Markdown> */}
            <div className="content_container" id="#Projects">  
                <Heading text="What do you want me to be?" style={{textAlign:"left"}}/>
                
                <div className='filter_container left wrap'>
                    <div className='filter' onPointerDown={()=> setActiveTags([])}>
                        <div className='label'>#Anything</div>
                    </div>
                    <div className='filter' onPointerDown={()=> setActiveTags(["Gamedev", "Unity", "Computer Graphics"])}>
                        <div className='label'>#Game Developer</div>
                    </div>
                    <div className='filter' onPointerDown={()=> setActiveTags(["Web Development"])}>
                        <div className='label'>#Web Developer</div>
                    </div>
                    <div className='filter' onPointerDown={()=> setActiveTags(["Simulation", "Uni", "AI", "Computer Graphics"])}>
                        <div className='label'>#Programmer</div>
                    </div>
                    <div className='filter' onPointerDown={()=> setActiveTags(["Game Design", "Graphic Design"])}>
                        <div className='label'>#Designer</div>
                    </div>
                </div>
            </div>
            <div className="content_container" id="#Projects">  
                <Heading text="Projects & Experience" hideRules style={{textAlign:"left"}}/>
                <div className='filter_container left wrap'>
                    {createTags()}
                </div>
                {activeTags.length == 0 &&
                    <div className='horizontal_container'>
                        <div className='text_left'>
                            <p>I start a lot of projects. If every artist has a thousand bad drawings
                                before they can draw a good one, then maybe I'm on track to hit gold.
                                I'm not sure if that's true, but I'm sure that I have a lot of bad projects. 
                                I'm also sure that I have a lot of good projects. Though many projects lie 
                                somewhere in between; in the realm of the mediocre and the unfinished.

                            </p>
                            <p>Let's stick to the good projects. </p>
                            <p>This is supposed to be    portfolio afterall... {"(ಠ_ಠ)"}</p>
                        </div>
                        <AsciiCarousel images={[
                        {caption: "Heart", imageURL: '/heart.jpg'}, 
                        {caption: "Atom", imageURL:'/logo192.png'},
                        ]}/>
                    </div>
                }
                {
                    activeTags.length != 0 && displayProjects(activeTags)
                }
                
            </div>
            
            <div className="content_double_container">
                <div className="content_container" id="#About-me">  
                    <Heading text="About me" style={{textAlign:"left"}}/>
                    <div className='vertical_container'>
                        <div className='text_middle' style={{textAlign: "left"}}>
                            <p>Hi I'm David, if you didn't know. Welcome to my about-me where we talk
                                about me. How exciting. I'm a developer, a designer, a writer, a reader, a thinker, a
                                dreamer, a doer, a procrastinator, a procrastinator, a procrastinator, a
                                procrastinator, a procrastinator, a procrastinator, a procrastinator, a
                                procrastinator, a procrastinator, a procrastinator, a procrastinator, a...
                            </p>
                            <div className='hr dashed'/>
                            <p>
                            Jokes aside, I would describe myself as an artistic-minded programmer. 
                            I use programming as a tool to create art.
                            </p>
                            <p>
                            I'm not a programmer who
                            creates art. I'm an artist who uses programming as a tool to create art.
                            </p>
                            <p>But I'm still a goddamn good programmer.</p>
                            <div className='hr dashed'/>
                            <p>My favourite topics are: </p>
                            <ul>
                                <li>Computer Vision</li>
                                <li>Computer Graphics</li>
                                <li>Mathematics</li>
                                <li>Physics</li>
                                <li>Music</li>
                                <li>Art</li>
                                <li>Science Fiction</li>
                                <li>History</li>
                                <li>Philosophy</li>
                                <li>Psychology</li>
                            </ul>
                            <div className='hr dashed'/>
                            <p>My favourite books are: </p>
                            <ul>
                                <li>1984</li>
                                <li>Dune</li>
                            </ul>
                            <div className='hr dashed'/>
                            <p>My hobbies include: </p>
                            <ul>
                                <li>Game Developing</li>
                                <li>Writing</li>
                                <li>Programming (a given)</li>
                                <li>Gaming</li>
                                <li>Anime</li>
                                <li>Making awesome portfolios</li>
                                <li>Sleeping</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="content_container" id="#Papers">  
                    <Heading text="Papers & Blogs" style={{textAlign:"right"}} />
                    <div className='vertical_container'>
                        <div className='text_middle'>
                            
                                {/* The beauty of being a developer is that you can make anything.
                                The beauty of being a university student is that you can't make anything.
                                The beauty of being a university student is that you can write about anything. */}
                                <p>The beauty of being a university student is that you occasionally get to write about anything.</p>
                                <p>The beauty of being a developer is that you can make anything.</p>
                                <p>The two go in hand in hand. I love to write about what I make and I love to make what I write about.</p>
                                <p>So here are some of my writings. Written by yours truly.</p>
                        </div>
                        <div className="emphasis"> <a href="https://plasmarcstudios.co.uk/containcorp-blog/">Containcorp Development Blog</a></div>
                        <div className="emphasis"> <a href="/files/Dissertation1.pdf">Generating Artificial Societies Dissertation</a></div>
                    </div>


                    <div style={{marginTop: 30}}  id="#Contact"></div>
                    <Heading text="Contact" style={{textAlign:"right"}}/>
                    <div className='vertical_container'>
                        <div className='text_middle'>
                            <p>Want to get in touch? </p>
                            <p>Send me an email at <a href="mailto: david.ogunlesi@yahoo.co.uk"/>david.ogunlesi@yahoo.co.uk</p>
                            <p>Or connect with me on <a href="https://www.linkedin.com/in/david-ogunlesi-b96b31182/">LinkedIn</a></p>
                        </div>
                    </div>
                </div>
                {/* <div className="content_container" id="#Contact">  
                    <Heading text="Contact" style={{textAlign:"right"}}/>
                    <div className='vertical_container'>
                        <div className='text_middle'>
                            
                        
                        </div>
                        <div className="emphasis"> <a href="/files/Dissertation1.pdf">Generating Artificial Societies</a></div>
                    </div>
                </div> */}
        </div>
    </div>
        
    );
}

function Heading({text, hideRules, style = {}}){
    return (
        <>
            {!hideRules && <div className='hr dashed'/>}
            <div className="title" style={style}>
                <h1><span className="name">{text}</span></h1>
            </div>
            {!hideRules && <div className='hr dotted'/>}
        </>
    );
}
