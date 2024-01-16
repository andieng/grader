import Header from './components/Header.lang.json';
import SideBar from './components/SideBar.lang.json';
import StudentList from './components/StudentList.lang.json';
import Home from './pages/Home.lang.json';
import Dashboard from './pages/Dashboard.lang.json';
import ClassDetails from './pages/ClassDetails.lang.json';
import User from './layouts/User.lang.json';
import Verify from './pages/Verify.lang.json';
import Admin from './layouts/Admin.lang.json';
import Invitation from './pages/Invitation.lang.json';
import AdminSideBar from './components/AdminSideBar.lang.json';
import Accounts from './pages/Accounts.lang.json';

const dictionary = {
  'components/Header': Header,
  'components/SideBar': SideBar,
  'components/StudentList': StudentList,
  'components/AdminSideBar': AdminSideBar,
  'pages/Dashboard': Dashboard,
  'pages/Home': Home,
  'pages/ClassDetails': ClassDetails,
  'pages/Verify': Verify,
  'pages/Invitation': Invitation,
  'layouts/User': User,
  'layouts/Admin': Admin,
  'pages/Accounts': Accounts,
};

const mappingDictionaryPath = (path) => {
  return dictionary[path];
};

export default mappingDictionaryPath;
