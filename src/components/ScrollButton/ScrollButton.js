import React, {Component} from "react";
import "./ScrollButton.scss";

export default class ScrollButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false
        };
    }
    componentDidMount() {
        console.log("mount")
        document.addEventListener("scroll", (e) => {
            this.toggleVisibility();
        });
    }

    toggleVisibility = () => {
        console.log(window.pageYOffset  + " offset")
        if (window.pageYOffset > 100) {
            this.setState({
                is_visible: true
            });
        } else {
            this.setState({
                is_visible: false
            });
        }
    }
    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    render() {
        const { is_visible } = this.state;
        return (
            <div className="scroll-button">
                {is_visible && (
                    <div onClick={() => this.scrollToTop()}>
                        <img src='' alt='Go to top'/>
                        Top
                    </div>
                )}
            </div>
        );
    }
}
