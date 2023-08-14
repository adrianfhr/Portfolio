import Navbar from '@src/components/Navbar/Navbar'
import Introduction from '@src/components/introduction/Introduction'
import Home from '@src/context/Home/Home'

const Landing: React.FC = () => {
  return (
    <div >
      <Navbar />
      <Home />
    </div>
  )
}

export default Landing
