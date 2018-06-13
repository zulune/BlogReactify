import React, { Component } from 'react';
import cookie from "react-cookies";
import 'whatwg-fetch';
import moment from 'moment';

class PostCreate extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.postTitleRef = React.createRef();
        this.postContentRef = React.createRef();
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
                    thisComp.clearForm()
                }).catch(error => {
                    console.log("error", error);
                    alert("An error occured, please try again later.")
                })
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let data = this.state;
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

    handleDraftChange(event) {
        this.setState({
            draft: !this.state.draft
        })
    }

    clearForm(event) {
        if (event) {
            event.preventDefault()
        }
        this.postCreateForm.reset()
    }

    clearFormRefs(event) {
        if (event) {
            event.preventDefault()
        }
        this.postTitleRef.current='';
        this.postContentRef.current='';
        // this.postPublishRef.current='';
    }

    componentDidMount() {
        this.setState({
            draft: false,
            title: null,
            content: null,
            publish: moment(new Date()).format("YYYY-MM-DD")
        });
        this.postTitleRef.current.focus()
    }

    render() {
        const {publish} = this.state;
        return (
            <div className='post-create'>
                <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
                    <div className="form-group">
                        <label htmlFor="title" className="label-control">Title: </label>
                        <input type="text" id="title"
                               name='title' className='form-control'
                               placeholder='Blog title'
                               ref={this.postTitleRef}
                               onChange={this.handleInputChange}
                               required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content" className="label-control">Content: </label>
                        <textarea name="content" id='content'
                                  className='form-control'
                                  placeholder='Content...'
                                  cols="30" rows="10"
                                  ref={this.postContentRef}
                                  onChange={this.handleInputChange}
                                  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="draft" className="label-control">
                            <input type="checkbox"
                                   id="draft"
                                   name='draft' className='mr-2'
                                   checked={this.state.draft}
                                   onChange={this.handleDraftChange}
                                   />
                          Draft</label>
                            <button onClick={(event) => {event.preventDefault(); this.handleDraftChange()}}
                                    className="btn btn-primary">Toggle Draft
                            </button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="publish" className="label-control">Publish: </label>
                        <input type="date" id="publish"
                               name='publish' className='form-group'
                               placeholder='Blog publish'
                               value={publish}
                               onChange={this.handleInputChange} required/>
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button className="btn btn-warning" onClick={this.clearForm}>Cancel</button>
                </form>
            </div>
        )
    }
}

export default PostCreate