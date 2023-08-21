import Navbar from '@src/components/Navbar/Navbar'
import Education from '@src/context/Education/Education'
import Introduction from '@src/context/Introduction/Introduction'
import Journey from '@src/context/Journey/Journey'
import Project from '@src/context/Project/Project'

const Landing: React.FC = () => {
  return (
    <div className="h-auto relative" >
      <Navbar />
      <Introduction />
      {/* <Education /> */}
      <Journey/>
      <Project/>
    </div>
  )
}

export default Landing
