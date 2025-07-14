import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Tab {
  id: string
  name: string
  path: string
  closable?: boolean
}

interface Store {
  tabs: Tab[]
  activeTabId: string | null
  handleAddTab: (tab: Tab) => void
  handleRemoveTab: (id: string) => void
  handleSetActiveTab: (id: string) => void
  handleClear: () => void
}

const useTabStore = create<Store>()(
  persist(
    set => ({
      tabs: [],
      activeTabId: null,

      handleAddTab: (newTab) => {
        set((state) => {
          const existingTab = state.tabs.find(tab => tab.id === newTab.id)
          if (existingTab) {
            return { activeTabId: newTab.id }
          }
          return {
            tabs: [...state.tabs, newTab],
            activeTabId: newTab.id,
          }
        })
      },
      handleRemoveTab: (idToRemove) => {
        set((state) => {
          const filteredTabs = state.tabs.filter(tab => tab.id !== idToRemove)
          let newActiveTabId = state.activeTabId

          if (idToRemove === state.activeTabId) {
            const indexRemoved = state.tabs.findIndex(tab => tab.id === idToRemove)
            if (indexRemoved > 0) {
              newActiveTabId = filteredTabs[indexRemoved - 1]?.id ?? null
            }
            else if (filteredTabs.length > 0) {
              newActiveTabId = filteredTabs[0].id
            }
            else {
              newActiveTabId = null
            }
          }

          return {
            tabs: filteredTabs,
            activeTabId: newActiveTabId,
          }
        })
      },
      handleSetActiveTab: (id) => {
        set({ activeTabId: id })
      },
      handleClear: () => {
        set({ tabs: [], activeTabId: null })
      },
    }),
    {
      name: 'storage__tab',
      storage: createJSONStorage(() => {
        return sessionStorage
      }),
    },
  ),
)

export { useTabStore }
