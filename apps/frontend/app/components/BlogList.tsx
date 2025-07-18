import type { Blog } from '~/types'
import { Link } from '@remix-run/react'

function BLogList({ list }: { list: Blog[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map(item => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          {item.imageUrl
            ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              )
            : (
                <div className="w-full h-48 bg-gray-200" />
              )}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 leading-tight">
              <Link to={`/blog/${item.slug}`} className="hover:text-indigo-600 transition duration-200">
                {item.title}
              </Link>
            </h2>

            {item.category && (
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 mr-2">
                {item.category}
              </span>
            )}

            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{item.authorName || 'Unknown Author'}</span>
              </div>

              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>
                  {item.views}
                  Views
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { BLogList }
