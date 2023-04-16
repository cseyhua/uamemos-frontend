
import MemoEditor from '@/components/MemoEditor'
import MemoList from '@/components/MemoList'
import { useUserStore } from '@/store/user'
import HomeSidebar from './HomeSidebar'

function Home(){

    const userStore = useUserStore()

    return (
        <div className='w-full flex flex-row justify-start items-start'>
            <div className=' flex-grow w-auto max-w-2xl px-4 sm:px-2 sm:pt-4'>
                <div className='w-full h-auto flex flex-col justify-start items-start bg-zinc-100 dark:bg-zinc-800 rounded-lg'>
                    {/* 用户是非拜访者模式则显示编辑器 */}
                    {!userStore.isVisitorMode() && <MemoEditor />}
                </div>
                <MemoList />
            </div>
            <HomeSidebar />
        </div>
    )
}

export default Home