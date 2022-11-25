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
        console.log("parallax on");
        document.addEventListener('mousemove', e => this.handleParallax(e));
    }

    handleParallax(e) {
            document.body.querySelectorAll(".parallax-layer").forEach(move => {
            let container = document.querySelector(".parallax-container");
            
                let moving_value = move.id;
                let x = ((e.clientX - container.style.width) * moving_value) / 150;
                let y = ((e.clientY - container.style.height) * moving_value) / 150;
                // console.log(move.id);
                // console.log("x:" + x, "y:" + y);
                move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
            });
    }

    removeParallax() {
        console.log("parallax off");
        document.removeEventListener('mousemove', this.handleParallax);
    }

    render() {

        return (
            <div id="parallax-container" className="parallax-container" onMouseEnter={this.parallax} onMouseLeave={this.removeParallax}>
                <img src="assets/parallax/1.png" id="1" className="parallax-layer" />
                <img src="assets/parallax/2.png" id="2" className="parallax-layer" />
                <img src="assets/parallax/3.png" id="3" className="parallax-layer" />
                <img src="assets/parallax/4.png" id="4" className="parallax-layer" />
                <img src="assets/parallax/5.png" id="5" className="parallax-layer" />
                <img src="assets/parallax/6.png" id="6" className="parallax-layer" />
                <img src="assets/parallax/7.png" id="7" className="parallax-layer" />
                <img src="assets/parallax/8.png" id="8" className="parallax-layer" />
            </div>
        )
    }
}

export default Canvas;