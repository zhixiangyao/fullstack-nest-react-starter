import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { BlogList } from '~/components/BlogList'
import { fetchBlogFindAll, fetchUserFind } from '~/fetchers'

export const meta: MetaFunction = () => {
  return [{ title: 'Author' }, { name: 'description', content: 'Welcome to the Author!' }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const res1 = await fetchUserFind({ username: params.name })
  const res2 = res1.data.user ? await fetchBlogFindAll({ uuid: res1.data.user?.uuid }) : void 0

  return {
    user: res1.data.user,
    list: res2?.data.list ?? [],
  }
}

export default function Author() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="py-8 max-w-168 mx-auto px-4 lg:px-0">
      <h1 className="text-4xl font-extrabold mb-10">{data.user?.username}</h1>

      <main className="flex flex-col gap-2">
        <BlogList list={data?.list} />
      </main>
    </div>
  )
}
