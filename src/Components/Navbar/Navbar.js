import AsciiHRule from '../AsciiHRule';
import './styles.css';

export function Navbar(){
    
return (

    <div className="navbar_container">
        <AsciiHRule char="="/>
        <div className="navbar">
            {/* <NavLink  link='' text='#Sandbox'/>   */}
            <NavLink  link='' text='#LinkedIn'/>  
            <NavLink  link='' text='#Projects'/>  
            <NavLink  link='' text='#About-me'/>
            <NavLink  link='' text='#Papers'/>  
            <NavLink  link='' text='#Contact'/>  
            {/* <NavLink  link='' text='#Design-Portfolio'/>   */}
            
        </div>
    </div>
    );
}

function NavLink({link, text}) {
    const makeEl = () => {
        if (link){
           return <a href={link}>{text}</a>
        }else{
            return text
        }
    }
  return (
      <div className="navbar_text"
      onClick={() => {
        let elementY = document.getElementById(text).getBoundingClientRect().top + window.pageYOffset;
        console.log(elementY);
        doScrolling(elementY, 500);
        console.log(document.getElementById(text));
    }}
      >
        {makeEl()}
      </div>
      );
}

function doScrolling(elementY, duration) { 
    var startingY = window.pageYOffset;
    var diff = elementY - startingY;
    var start;
  
    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      // Elapsed milliseconds since start of scrolling.
      var time = timestamp - start;
      // Get percent of completion in range [0, 1].
      var percent = Math.min(time / duration, 1);
  
      window.scrollTo(0, startingY + diff * percent);
  
      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    })
  }