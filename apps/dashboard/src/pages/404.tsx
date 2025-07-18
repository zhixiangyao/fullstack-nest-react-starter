import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      <h1 className="text-xl">404 Not Found</h1>
      <Button onClick={() => navigate('/home')}>Return to Home Page!</Button>
    </div>
  )
}

export { NotFound }
