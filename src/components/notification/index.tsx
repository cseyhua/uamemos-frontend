import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";

type NotificationType = 'INFO' | 'ERROR'

export type Notification = {
    content: string,
    timeout?: number,
    type?: NotificationType,
    id?: number
}

// @ts-ignore
const NotificationContextDispatchAdd = createContext((notification: Notification) => { })
const NotificationContextDispatchRemove = createContext((notification: Notification) => { })
const NotificationContext = createContext<Notification[]>([])

export function useNotification() {
    return {
        addNotification: useContext(NotificationContextDispatchAdd),
        removeNotification: useContext(NotificationContextDispatchRemove),
        notification: useContext(NotificationContext)
    }
}

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

const NoticeDiv = styled.div`
padding: 1em;
border: 1px solid green;
`

function Notice({ notice }: { notice: Notification }) {

    const { removeNotification } = useNotification()


    useEffect(() => {
        let timer = setTimeout(() => {
            removeNotification(notice)
        }, notice.timeout)
        return () => {
            clearTimeout(timer)
        }
    }, [notice])

    return <NoticeDiv>
        {notice.type+': '}{notice.content}
    </NoticeDiv>
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<Notification[]>([])
    const [nextNotificationID, setNextID] = useState(0)

    function addNotification(notification: Notification) {
        setNotification(state => [{ ...notification, type: notification.type || "INFO", timeout: notification.timeout || 5000, id: nextNotificationID }, ...state])
        setNextID(state => state + 1)
    }

    function removeNotification(notification: Notification) {
        setNotification((state) => state.filter(notice => notice.id != notification.id))
    }

    return <NotificationContext.Provider value={notification}>
        <NotificationContextDispatchAdd.Provider value={addNotification}>
            <NotificationContextDispatchRemove.Provider value={removeNotification}>
                <NotificationToast />
                {children}
            </NotificationContextDispatchRemove.Provider>
        </NotificationContextDispatchAdd.Provider>
    </NotificationContext.Provider>
}