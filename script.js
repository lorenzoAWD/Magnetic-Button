const lerp = (current, target, coeff) => {
    return current + (target - current)*coeff
}
const distance = (p1,p2) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}
let isMouseInWindow = true
document.addEventListener('mouseleave', () => {
    isMouseInWindow = false
})
let mousePosition = {x: 0, y: 0}
window.addEventListener('mousemove', e => {
    mousePosition.x = e.pageX
    mousePosition.y = e.pageY
    isMouseInWindow = true
})

class MagneticButton{
    constructor(button){
        this.button = button
        this.magneticArea = 80
        this.lerpCoeff = 0.05
        this.inertia = 0.6 //Se 1 il bottone segue il mouse per tutto il tragitto
        this.current = {
            x: 0,
            y: 0
        }
        this.initEvents()
    }   

    initEvents(){
        this.calcButtonRect()
        this.resize()
        window.requestAnimationFrame(this.update.bind(this))
    }
    
    calcButtonRect(){        
        this.buttonRect = this.button.getBoundingClientRect()
        this.buttonWidth = this.buttonRect.width
        this.buttonHeight = this.buttonRect.height
        this.buttonLeft = this.buttonRect.left
        this.buttonTop = this.buttonRect.top
        this.buttonCenter = {
            x: this.buttonLeft + this.buttonWidth/2,
            y: this.buttonTop + this.buttonHeight/2
        }
        // this.mouseDistanceFromButtonCenter = distance(mousePosition, this.buttonCenter)
    }

    resize(){
        window.addEventListener('resize', () => {
            this.calcButtonRect()
        } )        
    }

    update(){
        this.mouseDistanceFromButtonCenter = distance(mousePosition, this.buttonCenter)
        this.target = {
            x: 0,
            y: 0
        }
        //Mouse is in the magnetic area
        if(this.mouseDistanceFromButtonCenter < this.magneticArea && isMouseInWindow){
            this.target = {
                x: (mousePosition.x - this.buttonCenter.x) * this.inertia,
                y: (mousePosition.y - this.buttonCenter.y) * this.inertia
            }
        }
        this.current.x = lerp(this.current.x, this.target.x, this.lerpCoeff)
        this.current.y = lerp(this.current.y, this.target.y, this.lerpCoeff)
        this.button.style.transform = `translate(${this.current.x}px, ${this.current.y}px)`
        window.requestAnimationFrame(this.update.bind(this))
    }
}

const btns = [...document.querySelectorAll('.magnetic-btn')]
btns.forEach(btn => new MagneticButton(btn))