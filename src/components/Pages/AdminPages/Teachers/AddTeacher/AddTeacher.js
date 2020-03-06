import React, { Component } from 'react';

import classes from './AddTeacher.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class AddTeacher extends Component {
  state = {
    pageLoading: true,
    isLoading: false,
    teacherEmail: '',
    teacherCode: '',
    teacherRank: '',
    teacherType: 'Permanent'
  };

  componentDidMount() {
    this.setState({ pageLoading: false });
  }

  onFormSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    fetch('http://localhost:8080/admin/createteacher', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.teacherEmail,
        code: this.state.teacherCode,
        rank: this.state.teacherRank,
        type: this.state.teacherType
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        this.setState({ isLoading: false });
        console.log(resData);
        this.props.history.push('/teachers');
      })
      .catch(err => {
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(err);
        }
      });
  };

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  onFormCancel = e => {
    this.props.history.goBack();
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddTeacher}>
        <div className={classes.Title}>
          <h4>Add Teacher</h4>
        </div>
        <form
          className={classes.Form}
          onSubmit={this.onFormSubmit}
          method='POST'
        >
          <div className={classes.InputDiv}>
            <label htmlFor='teacherEmail'>Teacher Email</label>
            <Input
              type='text'
              name='teacherEmail'
              placeholder='Teacher Email'
              value={this.state.teacherEmail}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='teacherCode'>Teacher Code</label>
            <Input
              type='text'
              name='teacherCode'
              placeholder='Teacher Code'
              value={this.state.teacherCode}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='teacherRank'>Teacher Rank</label>
            <Input
              type='text'
              name='teacherRank'
              placeholder='Teacher Rank'
              value={this.state.teacherRank}
              onChange={this.onChange}
            />
          </div>

          <div className={classes.InputDiv}>
            <label htmlFor='teacherType'>Teacher Type</label>
            <SelectInput
              name='teacherType'
              placeholder='Teacher Type'
              onChange={this.onChange}
              disabled=''
              defaultValue={this.state.teacherType}
            >
              {['Permanent', 'Visiting']}
            </SelectInput>
          </div>

          <div className={classes.ButtonDiv}>
            <Button type='button' onClick={this.onFormCancel} color='#f83245'>
              Cancel
            </Button>
            <Button type='submit'>
              {this.state.isLoading ? 'Loading...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default AddTeacher;