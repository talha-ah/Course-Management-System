import React from 'react';

import classes from './Profile.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Tabs
    tab: 'info',
    // Info
    admin: '',
    firstName: '',
    lastName: '',
    email: '',
    // Password Inputs
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/getadmin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.setState({
          firstName: resData.user.firstName,
          lastName: resData.user.lastName,
          email: resData.user.email,
          pageLoading: false,
        });
      })
      .catch((err) => {
        try {
          err.json().then((body) => {
            this.props.notify(
              true,
              'Error',
              body.error.status + ' ' + body.message
            );
          });
        } catch (e) {
          this.props.notify(
            true,
            'Error',
            err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
          );
        }
      });
  }

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  onProfileUpdate = (e) => {
    e.preventDefault(); // Stop form submit
    this.setState({ isLoading: true });
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/editadmin`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.setState({ isLoading: false });
        this.props.notify(true, 'Success', resData.message);
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        try {
          err.json().then((body) => {
            this.props.notify(
              true,
              'Error',
              body.error.status + ' ' + body.message
            );
          });
        } catch (e) {
          this.props.notify(
            true,
            'Error',
            err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
          );
        }
      });
  };

  onPasswordUpdate = (e) => {
    e.preventDefault();

    if (this.state.newPassword === this.state.confirmPassword) {
      this.setState({ isLoading: true });
      fetch(`${process.env.REACT_APP_SERVER_URL}/admin/editadminpassword`, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: this.state.password,
          newPassword: this.state.newPassword,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token,
        },
      })
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({
            tab: 'info',
            isLoading: false,
            password: '',
            newPassword: '',
            confirmPassword: '',
          });
          this.props.notify(true, 'Success', resData.message);
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          try {
            err.json().then((body) => {
              this.props.notify(
                true,
                'Error',
                body.error.status + ' ' + body.message
              );
            });
          } catch (e) {
            this.props.notify(
              true,
              'Error',
              err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        });
    } else {
      this.props.notify(true, 'Error', 'Passwords do not match.');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Profile}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            <strong>Your Profile</strong>
          </span>
        </div>
        <div className={classes.TabsButtons}>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'info' })}
            style={{
              borderBottom:
                this.state.tab === 'info' ? '1px solid #3b3e66' : '',
            }}
          >
            Change Personal Info
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'password' })}
            style={{
              borderBottom:
                this.state.tab === 'password' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Change Password
          </div>
        </div>
        {this.state.tab === 'info' ? (
          <form
            method='POST'
            className={classes.Form}
            onSubmit={this.onProfileUpdate}
          >
            <div className={classes.InputGroup}>
              <div className={classes.InputDiv}>
                <label htmlFor='firstName'>First Name</label>
                <Input
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={this.state.firstName}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.InputDiv}>
                <label htmlFor='lastName'>Last Name</label>
                <Input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={this.state.lastName}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='email'>Email Address</label>
              <Input
                type='email'
                name='email'
                placeholder='Email Address'
                value={this.state.email}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                type='button'
                buttonType='red'
                onClick={() => this.props.history.push('/')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        ) : this.state.tab === 'password' ? (
          <form
            method='POST'
            className={classes.Form}
            onSubmit={this.onPasswordUpdate}
          >
            <div className={classes.InputDiv}>
              <label htmlFor='password'>Current Password</label>
              <Input
                type='password'
                name='password'
                placeholder='Current Password'
                value={this.state.password}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='newPassword'>New Password</label>
              <Input
                type='password'
                name='newPassword'
                placeholder='New Password'
                value={this.state.newPassword}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <Input
                type='password'
                name='confirmPassword'
                placeholder='Current Password'
                value={this.state.confirmPassword}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                type='button'
                buttonType='red'
                onClick={() => this.props.history.push('/')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        ) : (
          ''
        )}
      </div>
    );
    return page;
  }
}

export default EditProfile;