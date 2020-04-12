import React, { Component } from 'react';

import classes from './AddResult.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class AddResult extends Component {
  state = {
    // Loadings
    pageLoading: true,
    contentLoading: true,
    isLoading: false,
    // Data
    class: '',
    materialId: '',
    materialTitle: '',
    materialGrade: 10,
    materialArray: '',
    materialsDoc: '',
    selectSection: '',
    selectSession: '',
    result: '',
  };

  async componentDidMount() {
    const tempMaterialArray = [];
    if (this.props.location.state.pageFor === 'Assignment') {
      this.props.location.state.materialDoc.assignments.map((material) => {
        return tempMaterialArray.push(material.title);
      });
    } else if (this.props.location.state.pageFor === 'Quiz') {
      this.props.location.state.materialDoc.quizzes.map((material) => {
        return tempMaterialArray.push(material.title);
      });
    } else if (this.props.location.state.pageFor === 'Paper') {
      this.props.location.state.materialDoc.papers.map((material) => {
        return tempMaterialArray.push(material.title);
      });
    }
    this.setState({
      materialArray: tempMaterialArray,
      materialId: this.props.location.state.materialId,
      materialTitle: this.props.location.state.materialTitle,
      materialsDoc: this.props.location.state.materialDoc,
      selectSession: this.props.location.state.session,
      pageLoading: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.materialTitle !== prevState.materialTitle)
      this.getMaterialFromServer();
    if (this.state.selectSection !== prevState.selectSection) this.fetchClass();
  }

  fetchClass = async () => {
    const session = this.state.selectSession.substring(0, 4);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/class/getclass/${session}/${this.state.selectSection}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      );
      if (!res.ok) throw res;
      const resData = await res.json();
      this.setState({
        class: resData.class,
        contentLoading: false,
      });
    } catch (err) {
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
    }
  };

  getMaterialFromServer = async () => {
    this.setState({ contentLoading: true });
    const materialTitle = this.state.materialTitle;
    var materialId;
    var materialURL;

    if (this.props.location.state.pageFor === 'Assignment') {
      this.state.materialsDoc.assignments.some((material) => {
        if (material.title === materialTitle) {
          materialId = material._id;
          return true;
        }
        return false;
      });
      materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/getassignmentresult/${this.state.materialsDoc._id}/${materialId}`;
    } else if (this.props.location.state.pageFor === 'Quiz') {
      this.state.materialsDoc.quizzes.some((material) => {
        if (material.title === materialTitle) {
          materialId = material._id;
          return true;
        }
        return false;
      });
      materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/getquizresult/${this.state.materialsDoc._id}/${materialId}`;
    } else if (this.props.location.state.pageFor === 'Paper') {
      this.state.materialsDoc.papers.some((material) => {
        if (material.title === materialTitle) {
          materialId = material._id;
          return true;
        }
        return false;
      });
      materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/getpaperresult/${this.state.materialsDoc._id}/${materialId}`;
    }
    try {
      const res = await fetch(materialURL, {
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
      });
      if (!res.ok) throw res;
      const resData = await res.json();
      this.setState({
        result: resData.material.result,
        materialId: materialId,
        materialTitle: resData.material.title,
        materialGrade: resData.material.grade,
        selectSection: resData.material.section,
        contentLoading: false,
      });
    } catch (err) {
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
    }
  };

  onSubmitHandler = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const formData = new FormData(e.target);
    const data = {};
    var error = false;
    var materialURL;

    for (var [key, value] of formData.entries()) {
      if (value === '' || +value > +this.state.materialGrade) {
        error = true;
      }
      data[key] = value;
    }
    if (!error) {
      if (this.props.location.state.pageFor === 'Assignment') {
        materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/addassignmentresult/${this.state.materialsDoc._id}/${this.state.materialId}`;
      } else if (this.props.location.state.pageFor === 'Quiz') {
        materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/addquizresult/${this.state.materialsDoc._id}/${this.state.materialId}`;
      } else if (this.props.location.state.pageFor === 'Paper') {
        materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/addpaperresult/${this.state.materialsDoc._id}/${this.state.materialId}`;
      }
      try {
        const res = await fetch(materialURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.token,
          },
          body: JSON.stringify({
            data: data,
          }),
        });
        if (!res.ok) throw res;
        const resData = await res.json();
        this.setState({
          result: resData.savedMaterial.result,
          isLoading: false,
        });
        this.props.notify(true, 'Success', resData.message);
      } catch (err) {
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
      }
    } else {
      this.setState({ isLoading: false });
      this.props.notify(
        true,
        'Error',
        'Every should not be empty or greater than totals marks!'
      );
    }
  };

  onChangeCourse = (e) => {
    const title = e.target.value;
    this.setState({
      materialTitle: title,
    });
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddResult}>
        <div className={classes.Caption}>
          <span>
            Subject: <strong>{this.props.location.state.courseTitle}</strong>
          </span>
          <span className={classes.CaptionSpan}>
            {this.state.selectSection === ''
              ? ''
              : `Section: ${this.state.selectSection} - ${this.state.selectSession}`}
          </span>
          <span className={classes.CaptionSpan}>
            {this.props.location.state.pageFor}:
            <SelectInput
              style={{
                width: '150px',
                marginLeft: '10px',
                marginRight: '10px',
              }}
              name='materialTitle'
              value={this.state.materialTitle}
              onChange={this.onChangeCourse}
            >
              {this.state.materialArray}
            </SelectInput>
          </span>
        </div>
        <form onSubmit={this.onSubmitHandler}>
          <table className={classes.AddResultTable}>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th colSpan='2'>Name</th>
                <th>Marks / {this.state.materialGrade}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.contentLoading ? (
                <tr>
                  <td colSpan='4'>
                    <Spinner />
                  </td>
                </tr>
              ) : (
                <>
                  {!this.state.class.students ? (
                    <tr>
                      <td colSpan='4'>
                        <Spinner />
                      </td>
                    </tr>
                  ) : (
                    Object.entries(this.state.class.students).map((student) => {
                      return (
                        <tr
                          key={student[0]}
                          className={classes.AssignmentsTableRow}
                        >
                          <td>
                            <strong>{student[1].rollNumber}</strong>
                          </td>
                          <td style={{ textAlign: 'left' }} colSpan='2'>
                            {student[1].fullName}
                          </td>
                          {/* <td>{this.state.class.batch}</td> */}
                          <td>
                            <input
                              className={classes.MarksInput}
                              type='number'
                              name={student[1].rollNumber}
                              defaultValue={
                                this.state.result
                                  ? this.state.result[student[1].rollNumber]
                                  : ''
                              }
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </>
              )}
            </tbody>
          </table>

          <div className={classes.ButtonDiv}>
            <Button type='submit'>
              {this.state.isLoading ? 'Loading' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default AddResult;
