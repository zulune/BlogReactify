import React, { Component } from 'react';
import cookie from "react-cookies";
import 'whatwg-fetch';

class PostCreate extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            draft: false,
            title: null,
            content: null,
            publish: null
        }
    }

    createPosts(data) {
        const endpoint = '/api/posts/';
        const csrfToken = cookie.load('csrftoken');
        let thisComp = this;
        if (csrfToken !== undefined) {
            let lookupOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify(data),
                credentials: 'include'
            };
            fetch(endpoint, lookupOptions)
                .then(response => {
                    return response.json()
                }).then(responseData => {
                    console.log(responseData);
                    if (thisComp.props.newPostItemCreated) {
                        thisComp.props.newPostItemCreated(responseData)
                    }
                }).catch(error => {
                    console.log("error", error);
                    alert("An error occured, please try again later.")
                })
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let data = this.state;
        if (data['draft'] === 'on') {
            data['draft'] = true
        } else {
            data['draft'] = false
        }
        this.createPosts(data);
    }

    handleInputChange(event) {
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        if (key === 'title') {
            if (value.length > 110) {
                alert("This title is too long")
            }
        }
        this.setState({
            [key]: value
        })
    }

    componentDidMount() {
        this.setState({
            draft: false,
            title: null,
            content: null,
            publish: null
        })
    }

    render() {
        return (
            <div className='post-create'>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="label-control">Title: </label>
                        <input type="text" id="title" name='title' className='form-control' placeholder='Blog title' onChange={this.handleInputChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content" className="label-control">Content: </label>
                        <textarea name="content" id='content' className='form-control' placeholder='Content...' cols="30" rows="10" onChange={this.handleInputChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="draft" className="label-control">
                            <input type="checkbox" id="draft" name='draft' className='mr-2' placeholder='Blog draft' onChange={this.handleInputChange}/>
                          Draft</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="publish" className="label-control">Publish: </label>
                        <input type="date" id="publish" name='publish' className='form-group' placeholder='Blog publish' onChange={this.handleInputChange} required/>
                    </div>
                    <button className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}

export default PostCreate