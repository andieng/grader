import Header from './components/Header.lang.json';
// import Footer from './components/Footer.lang.json';
import Dashboard from './pages/Dashboard.lang.json';
import Home from './pages/Home.lang.json';
import SideBar from './components/SideBar.lang.json';
import ClassDetail from './pages/ClassDetail.lang.json';

const dictionary = {
  'components/Header': Header,
  'components/SideBar': SideBar,
  'pages/Dashboard': Dashboard,
  'pages/Home': Home,
  'pages/ClassDetail': ClassDetail,
};

const mappingDictionaryPath = (path) => {
  return dictionary[path];
};

export default mappingDictionaryPath;
