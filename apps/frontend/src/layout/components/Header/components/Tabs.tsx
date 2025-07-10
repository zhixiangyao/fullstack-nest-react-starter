import { Tag, theme } from 'antd'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { genTitle } from '~/router'
import { useTabStore } from '~/stores/useTabStore'

function Tabs() {
  const { tabs, activeTabId, handleAddTab, handleRemoveTab, handleSetActiveTab } = useTabStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const handleTabClick = (path: string, id: string) => {
    handleSetActiveTab(id)
    navigate(path)
  }

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (id === activeTabId) {
      const removedIndex = tabs.findIndex(tab => tab.id === id)
      let nextPath = '/home'

      if (tabs.length > 1) {
        if (removedIndex > 0) {
          nextPath = tabs[removedIndex - 1].path
        }
        else if (tabs.length > 1) {
          nextPath = tabs[1].path
        }
      }

      navigate(nextPath)
    }

    handleRemoveTab(id)
  }

  useEffect(() => {
    const currentPath = location.pathname
    const currentTabId = currentPath
    const pageName = genTitle(currentPath) ?? '??'

    handleAddTab({
      id: currentTabId,
      name: pageName,
      path: currentPath,
      closable: currentPath !== '/home',
    })
    handleSetActiveTab(currentTabId)
  }, [location.pathname, handleAddTab, handleSetActiveTab])

  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <Tag
          key={tab.id}
          className="cursor-pointer select-none !m-0 min-w-20 !flex !justify-between items-center"
          closable={tab.closable}
          bordered={false}
          onClose={e => handleCloseTab(tab.id, e)}
          onClick={() => handleTabClick(tab.path, tab.id)}
          color={activeTabId === tab.id ? token.colorPrimary : ''}
        >
          {tab.name}
        </Tag>
      ))}
    </div>
  )
}

export { Tabs }
