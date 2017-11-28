import React from 'react';

import ReactDOM from 'react-dom';




class Form extends React.Component {
    constructor() {
        super();
        this.state = {
        }
        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    addItem(e) {
        
    }
    render() {
        return (
            <div>
                <section>
                    <form onSubmit={this.addItem} className="addForm">
                        <label htmlFor="location">Location: </label>
                        <input type="text" name="postalCode" onChange={this.handleChange} />

                        <p>Select an animal:</p>
                        <label htmlFor="animalType">Cat</label>
                        <input type="radio" name="type" value="cat" onChange={this.handleChange}/>
                        <label htmlFor="animalType">Dog</label>
                        <input type="radio" name="type" value="dog" onChange={this.handleChange}/>

                        <p>How big do you want the animal to be:</p>
                        <label htmlFor="size">Small</label>
                        <input type="radio" name="size" value="small" onChange={this.handleChange}/>
                        <label htmlFor="size">Medium</label>
                        <input type="radio" name="size" value="medium" onChange={this.handleChange}/>
                        <label htmlFor="size">Large</label>
                        <input type="radio" name="size" value="large" onChange={this.handleChange}/>

                        <p>Select a sex:</p>
                        <label htmlFor="sex">Male</label>
                        <input type="radio" name="sex" value="male" onChange={this.handleChange}/>
                        <label htmlFor="sex">Female</label>
                        <input type="radio" name="sex" value="female" onChange={this.handleChange}/>

                        <input type='submit' className='button add' value='Submit' onChange={this.handleChange}/>
                    </form>
                </section>
            </div>
        )
    }
}

export default Form;