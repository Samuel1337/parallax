import React from "react";
import "./canvas.scss";

class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.parallax = this.parallax.bind(this);
        this.removeParallax = this.removeParallax.bind(this);
        this.handleParallax = this.handleParallax.bind(this);
    }

    parallax() {
        document.addEventListener('mousemove', e => this.handleParallax(e));
    }

    handleParallax(e) {
            document.body.querySelectorAll(".parallax-layer").forEach(move => {
            
                let moving_value = move.id;
                let x = ((e.clientX - (window.innerWidth / 2)) * moving_value) / 150;
                let y = ((e.clientY - (window.innerHeight / 2)) * moving_value) / 150;

                move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
            });
    }

    removeParallax() {
        document.removeEventListener('mousemove', this.handleParallax);
    }

    render() {

        return (
            <div id="parallax-container" className="parallax-container" onMouseEnter={this.parallax} onMouseLeave={this.removeParallax}>
                <img src="eileen/parallax/0.png" id="0" className="root-layer" />
                <img src="eileen/parallax/1.png" id="1" className="parallax-layer" />
                <img src="eileen/parallax/2.png" id="2" className="parallax-layer" />
                <img src="eileen/parallax/3.png" id="3" className="parallax-layer" />
                <img src="eileen/parallax/4.png" id="4" className="parallax-layer" />
                <img src="eileen/parallax/5.png" id="5" className="parallax-layer" />
            </div>
        )
    }
}

export default Canvas;