import React, { Component } from 'react';

class PostCreate extends Component{
    render() {
        return (
            <div className='post-create'>
                <form>
                    <div className="form-group">
                        <label htmlFor="title" className="label-control">Title: </label>
                        <input type="text" name='title' className='form-control' placeholder='Blog title'/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content" className="label-control">Content: </label>
                        <textarea name="content" id='content' className='form-control' placeholder='Content...' cols="30" rows="10" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="draft" className="label-control">
                            <input type="checkbox" name='title' className='mr-2' placeholder='Blog draft'/>
                          Draft</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="publish" className="label-control">Publish: </label>
                        <input type="date" name='publish' className='form-group' placeholder='Blog publish'/>
                    </div>
                    <button className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}

export default PostCreate