import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileMedicalAlt,
  faClipboardList,
  faFileAlt,
  faTachometerAlt,
  faBookReader,
  faBookOpen,
  faClipboard,
  faPollH
} from '@fortawesome/free-solid-svg-icons';

import classes from './Sidebar.module.css';
import logo from '../../logo.png';

const TeacherSidebar = () => {
  return (
    <div className={classes.Sidebar}>
      <NavLink exact to='/' className={classes.SidebarBrand}>
        <img src={logo} alt='logo' className={classes.SidebarBrandImg} />
      </NavLink>
      <ul className={classes.SidebarNav}>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/profile' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faTachometerAlt} />
            Dashboard
          </NavLink>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/courses'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Courses Section
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/courses' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faFileAlt} />
            Courses
          </NavLink>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/coursedescription'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            NCEAC Forms
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/coursedescription'
            className={classes.SidebarNavLink}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            Course Description
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/coursemonitoring'
            className={classes.SidebarNavLink}
          >
            <FontAwesomeIcon icon={faFileMedicalAlt} />
            Course Monitoring
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/courselog' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faClipboardList} />
            Course Log
          </NavLink>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/materials'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Materials
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/quizzes' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faPollH} />
            Quizzes
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/assignments' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faBookReader} />
            Assignments
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/papers' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faBookOpen} />
            Papers
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink exact to='/reports' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faClipboard} />
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;