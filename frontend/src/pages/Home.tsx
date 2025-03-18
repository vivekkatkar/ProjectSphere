import { useState } from 'react'
import { Background } from '../createdComp/Background'
import { Link } from 'react-router-dom'


function Home() {
  const [count, setCount] = useState(0)

  function handleClick (){
    
  }

  return (
    <div className="relative"> {/* Add 'relative' here */}
      <Background /> {/* Background is now positioned relative to its parent */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-8"> 
        <div className=''>Logo</div>
            <button className="bg-gray-700 text-white rounded-sm p-2" onClick={handleClick}>
                <Link to="/signup">Get started</Link>
            </button>
      </div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-center'>
        <h1 className='text-6xl font-bold'>PROJECTSPHERE</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur aliquam qui ullam id .</p>
      </div>
    </div>
  )
}

export default Home
