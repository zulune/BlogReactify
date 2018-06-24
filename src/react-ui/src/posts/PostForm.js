import React, { Component } from 'react';
import cookie from "react-cookies";
import 'whatwg-fetch';
import moment from 'moment';

class PostForm extends Component {
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

    updatePosts(data) {
        const {post} = this.props;
        const endpoint = `/api/posts/${post.slug}/`;
        const csrfToken = cookie.load('csrftoken');
        let thisComp = this;
        if (csrfToken !== undefined) {
            let lookupOptions = {
                method: 'PUT',
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
                    // console.log(responseData);
                    if (thisComp.props.postItemUpdated) {
                        thisComp.props.postItemUpdated(responseData)
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
        const {post} = this.props;
        if (post !== undefined) {
            this.updatePosts(data);
        } else {
            this.createPosts(data)
        }
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
        this.defaultState()
    }

    clearFormRefs() {
        this.postTitleRef.current = '';
        this.postContentRef.current = '';
        // this.postPublishRef.current='';
    }

    defaultState() {
        this.setState({
            draft: false,
            title: null,
            content: null,
            publish: moment(new Date()).format("YYYY-MM-DD")
        });
    }

    componentDidMount() {
        const {post} = this.props;
        if (post !== undefined) {
            this.setState({
                draft: post.draft,
                title: post.title,
                content: post.content,
                publish: moment(post.publish).format("YYYY-MM-DD")
            });
        } else {
            this.defaultState()
        }
        this.postTitleRef.current.focus()
        this.postContentRef.current.focus()
    }

    render() {
        const { publish } = this.state;
        const {title} = this.state;
        const {content} = this.state;
        const cancelClass = this.props.post !== undefined ? "d-none" : "";
        return (
            <div className='post-create'>
                <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
                    <div className="form-group">
                        <label htmlFor="title" className="label-control">Title: </label>
                        <input type="text" 
                            id="title"
                            name='title'
                            value={title} 
                            className='form-control'
                            placeholder='Blog title'
                            ref={this.postTitleRef}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content" className="label-control">Content: </label>
                        <textarea name="content" id='content'
                            value={content}
                            className='form-control'
                            placeholder='Content...'
                            cols="30" rows="10"
                            ref={this.postContentRef}
                            onChange={this.handleInputChange}
                            required />
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
                        <button onClick={(event) => { event.preventDefault(); this.handleDraftChange() }}
                            className="btn btn-primary">Toggle Draft
                            </button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="publish" className="label-control">Publish: </label>
                        <input type="date" id="publish"
                            name='publish' className='form-group'
                            placeholder='Blog publish'
                            value={publish}
                            onChange={this.handleInputChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button className={`btn btn-secondary`} onClick={this.clearForm}>Clear</button>
                </form>
            </div>
        )
    }
}

export default PostForm