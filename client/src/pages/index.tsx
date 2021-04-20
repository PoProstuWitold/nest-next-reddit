import React, { 
    Fragment, 
    //useEffect, useState 
} from 'react'
import Image from 'next/image'
import { Sub, Post } from '../types'
import Link from 'next/link'
//import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
// import { GetServerSideProps } from 'next'
import PostCard from '../components/PostCard'
import Head from 'next/head'
import useSWR from 'swr'
import { useAuthState } from '../context/auth'
dayjs.extend(relativeTime)

interface indexProps {

}

const index: React.FC<indexProps> = ({}) => {
    const isBrowser = () => typeof window !== "undefined"
    console.log(isBrowser())
    if (isBrowser()) {
        window.addEventListener('load', () => revalidatePosts())
    }
    const { authenticated } = useAuthState()
    const { data: posts, revalidate: revalidatePosts } = useSWR('/post/posts')
    const { data: topSubs } = useSWR('/sub/subs/top')
    // const [posts, setPosts] = useState<Post[]>([])
    // useEffect(() => {
    //     axios.get('/post/posts')
    //         .then((res) => {
    //             setPosts(res.data)
    //             console.log(res.data)
    //         })
    //         .catch((err) => console.log(err))
    // }, [])

    return (
        <Fragment>
        <Head>
            <title>reddit: the front page of the internet</title>
        </Head>
        <div className="container flex pt-4">
            {/* Posts feed */}
            <div className="w-full px-4 md:w-160 md:p-0">
            {posts?.map((post: Post) => (
                <PostCard post={post} key={post.identifier} revalidate={revalidatePosts} />
            ))}
            </div>
            {/* Sidebar */}
            <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub: Sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="mr-2">
                    <Link href={`/r/${sub.name}`}>
                      <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className="bg-cover rounded-full cursor-pointer"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                      </a>
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
        </div>
        </Fragment>
    )

}

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const res = await axios.get('/post/posts')

//     return { props: { posts: res.data } }
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }

export default index