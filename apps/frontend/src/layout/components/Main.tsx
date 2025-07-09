import { Outlet } from 'react-router-dom'

function Main() {
  return (
    <div className="h-[calc(100vh_-_40px)] w-full overflow-y-auto overflow-x-hidden p-3">
      <Outlet />
    </div>
  )
}

export { Main }
