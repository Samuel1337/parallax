import React from "react";
import "./canvas.scss";

class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.handleMove = this.handleMove.bind();
        this.setUpCanvas = this.setUpCanvas.bind();
    }

    componentDidMount() {
        const canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
        
        // resizes canvas to fit the screen
        canvas.width = window.innerWidth*0.8;
        canvas.height = window.innerHeight*0.8;

        this.setUpCanvas(ctx);

        // document.addEventListener("pointermove", (evt) => this.handleMove(evt), false);
    }    

    setUpCanvas(ctx) {
        
        ctx.fillStyle = '#123321'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        let parallax1 = new Image();        parallax1.src = 'assets/parallax/1.png';
        let parallax2 = new Image();        parallax2.src = 'assets/parallax/2.png';
        let parallax3 = new Image();        parallax3.src = 'assets/parallax/3.png';
        let parallax4 = new Image();        parallax4.src = 'assets/parallax/4.png';
        let parallax5 = new Image();        parallax5.src = 'assets/parallax/5.png';
        let parallax6 = new Image();        parallax6.src = 'assets/parallax/6.png';
        let parallax7 = new Image();        parallax7.src = 'assets/parallax/7.png';
        let parallax8 = new Image();        parallax8.src = 'assets/parallax/8.png';

        parallax1.onload = function(){
            ctx.drawImage(parallax1, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax2.onload = function(){
            ctx.drawImage(parallax2, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax3.onload = function(){
            ctx.drawImage(parallax3, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax4.onload = function(){
            ctx.drawImage(parallax4, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax5.onload = function(){
            ctx.drawImage(parallax5, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax6.onload = function(){
            ctx.drawImage(parallax6, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax7.onload = function(){
            ctx.drawImage(parallax7, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        parallax8.onload = function(){
            ctx.drawImage(parallax8, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
    }

    handleMove(evt) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos = [
            evt.clientX - rect.left,
            evt.clientY - rect.top
        ];
    }

    render() {

        return (
            <canvas height="800px" width="1500px"></canvas>
        )
    }
}

export default Canvas;