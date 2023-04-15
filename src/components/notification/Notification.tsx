import styled from "styled-components"
import { useNotification } from "."
import { useEffect } from "react"
import { Notification } from '.'

const NotificationBoard = styled.div`
position: fixed;
top: 1em;
right:1em;
`

function NotificationToast() {

    const { notification } = useNotification()

    return (
        <NotificationBoard>
            {notification.map(notice =>
                <Notice key={notice.id} notice={notice} />
            )}
        </NotificationBoard>
    )
}

function Notice({ notice }: { notice: Notification }) {

    useEffect(() => {
        let timer = setTimeout(() => {

         })
        return () => {
            clearTimeout(timer)
        }
    }, [])

    return <div>
        {notice.content}
    </div>
}

export default NotificationToast