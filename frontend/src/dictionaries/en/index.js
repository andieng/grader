import Header from './components/Header.lang.json';
import SideBar from './components/SideBar.lang.json';
import StudentList from './components/StudentList.lang.json';
import Home from './pages/Home.lang.json';
import Dashboard from './pages/Dashboard.lang.json';
import ClassDetails from './pages/ClassDetails.lang.json';
import User from './layouts/User.lang.json';
import Verify from './pages/Verify.lang.json';
import Invitation from './pages/Invitation.lang.json';

const dictionary = {
  'components/Header': Header,
  'components/SideBar': SideBar,
  'components/StudentList': StudentList,
  'pages/Dashboard': Dashboard,
  'pages/Home': Home,
  'pages/ClassDetails': ClassDetails,
  'pages/Verify': Verify,
  'layouts/User': User,
  'pages/Invitation': Invitation,
};

const mappingDictionaryPath = (path) => {
  return dictionary[path];
};

export default mappingDictionaryPath;
