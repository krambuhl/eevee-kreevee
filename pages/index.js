import Head from 'next/head'
import Div100vh from 'react-div-100vh'
import '../assets/styles.css'

const styles = {
  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    width: '100vw',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 320
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100vw',
    height: '100%'
  }
}

const colors = {
  purple: '#681c56',
  yellow: '#ffef78',
  green: '#358c1f',
}

const logos = {
  purple: '/static/logo-byzantium.svg',
  yellow: '/static/logo-yellow.svg',
  green: '/static/logo-green.svg'
}

const randomColor = () => {
  const keys = Object.keys(colors)
  return keys[Math.floor(Math.random() * keys.length)]
}

export default class Page extends React.Component {
  constructor (props) {
    super(props)

    this.canvas = React.createRef();
    this.state = {
      currentColor: 'yellow',
      currentBallColor: 'purple',
      currentBackgroundColor: 'yellow'
    }

    setInterval(() => {
      this.setState({
        // currentColor: randomColor()
      })
    }, 1000)

    setInterval(() => {
      this.setState({
        // currentBackgroundColor: randomColor()
      })
    }, 851)
  }

  componentDidMount () {
    var currentCanvas = this.canvas.current
    var stage = new createjs.Stage(currentCanvas);

    createjs.Ticker.on("tick", tick);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    stage.autoClear = false; // Draw back on itself. This makes the additive effect

    var w = 100, h = 100;

    // Init Code
    // Simple Red Star
    var s = new createjs.Shape()
    s.color = s.graphics.f(colors[this.state.currentBallColor]).command;
    s.graphics.dp(0,0,10,4,0);

    // Black box for fading out
    var bg = new createjs.Shape().set({alpha:0.04});
    bg.graphics.f(colors[this.state.currentBackgroundColor]).dr(-200,-200,1000,1000);

    // Bitmap pointing at the currentCanvas
    // This is scaled up to make a "zoom in" effect as it draws larger each time
    var bmp = new createjs.Bitmap(currentCanvas)
      .set({scale: 0.9, rotation:1, compositeOperation:"darken"});

    // Another Bitmap pointing at the currentCanvas
    // This is scaled down to make a "zoom out" effect, as it draws smaller each time
    var bmp2 = new createjs.Bitmap(currentCanvas)
      .set({scale: 1.15, rotation:1, compositeOperation:"darken"});

    // Add all to the stage
    stage.addChild(bmp, bmp2, bg, s);

    handleResize(); // Force a resize

    // Tick Code
    var index = 1;
    var subtick = 1;
    var state = this.state
    function tick(event) {
      subtick++;
      if (subtick % 60 === 0) {
        index++; // For cos/sin increments
      }
      // s.rotation += Math.cos(index) * 100; // rotate the star
      // s.color.style = colors[state.currentBackgroundColor]
      bmp.rotation = Math.tan(index * 10)

      // Move the star back and forth.
      // Period is varied between x & y to get a better effect
      s.x = (w / 2) + Math.tan(index / 1) * w / 102;
      s.y = (h / 2) + Math.cos(index / 4) * h / 170;

      stage.update(event);
    }

    // Resize Code
    window.addEventListener("resize", handleResize, false);
    function handleResize(event) {
      w = window.innerWidth;
      h = window.innerHeight;
      currentCanvas.width = w;
      currentCanvas.height = h;

      // Layout other assets
      // Just center the bitmaps (and their registration points)
      bmp.x = bmp.regX = bmp2.x = bmp2.regX = (w>>1) + 10;
      bmp.y = bmp.regY = bmp2.y = bmp2.regY = h>>1;

      // Scale the bg to fit over the currentCanvas
      bg.scaleX = w/100;
      bg.scaleY = h/100;

      stage.update();
    }
  }

  render () {
    const { currentColor, currentBackgroundColor } = this.state
    return (
      <Div100vh>
        <Head>
          <title>Eevee Kreevee</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
        </Head>

        <div style={styles.container}>
          <div style={styles.logo}>
            <img src={logos[currentColor]} alt="EEVEE KREEVEE" />
          </div>
        </div>

        <canvas
          ref={this.canvas}
          style={{
            backgroundColor: colors[currentBackgroundColor],
            ...styles.canvas
          }}
        />
      </Div100vh>
    )
  }
}
