import Navbar from '@src/components/Navbar/Navbar'
import Education from '@src/context/Education/Education'
import Introduction from '@src/context/Introduction/Introduction'

const Landing: React.FC = () => {
  return (
    <div className="h-auto relative" >
      <Navbar />
      <Introduction />
      <Education />
    </div>
  )
}

export default Landing
