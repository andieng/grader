import Header from './components/Header.lang.json';
// import Footer from './components/Footer.lang.json';
import Dashboard from './pages/Dashboard.lang.json';
import Home from './pages/Home.lang.json';

const dictionary = {
  'components/Header': Header,

  'pages/Dashboard': Dashboard,
  'pages/Home': Home,
};

const mappingDictionaryPath = (path) => {
  return dictionary[path];
};

export default mappingDictionaryPath;
