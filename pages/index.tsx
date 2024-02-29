import Navbar from '@src/components/Navbar/Navbar'
import Contact from '@src/context/Contact/Contact'
import Home from '@src/context/Home/Home'
import Introduction from '@src/context/Introduction/Introduction'
import Experience from '@src/context/Experience/Experience'
import Project from '@src/context/Project/Project'
import Footer from '@src/components/Footer/Footer'

const Homepage: React.FC = () => {
  return (
     <>
      <Navbar />
      <Home/>
      <Introduction />
      <Experience/>
      <Project/>
      <Contact/>
      <Footer/>
    </>
  )
}

export default Homepage;
