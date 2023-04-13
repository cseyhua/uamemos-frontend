import styled from "styled-components"
import React, { useState } from "react"

import { Full, Row, Column } from "@/layouts"
import Button from '@/components/Button'
import InputBox from "@/components/Input"
import {useLoading} from '@/hooks'
import Spring from '@/components/Loading'
import * as api from '@/helper/api'

const FullFlex = styled(Full)({
    padding: '1em',
    display: "flex",
    flexDirection: "column"
})

const AuthMain = styled.div({
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
})

const AuthFooter = styled.div({

})

const AuthInfoRow = styled(Row)`
width: 200px;
gap: 4px;
font-size: 1.25em;
`

const AuthInputRow = styled(Row)`
justify-content: center;
gap: 1em;
`
const AuthBoardColumn = styled(Column)`
gap: 2em;
`

const VeriDivier = styled.div`
width: 2px;
height: 90%;
border:1px solid #303030;
`
const SpanButton = styled.span`
font-size: 1.25em;
color: ${(props: any) => props.color || '#303030'};
cursor:pointer;
`

function Auth() {

    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const submitState = useLoading(false)

    const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value as string)
    }

    const handlePassInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value as string)
    }

    const handleSignInBtnClick = async () => {
        if(name === "" || pass === ""){return}
        if(submitState.isPending){return}
        try {
            submitState.setPending()
            await api.signin(name, pass)
        } catch (error) {
            
        }finally{
            submitState.setResolve()
        }
    }

    const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        // 关闭默认提交行为
        e.preventDefault()
    }

    return (
        <FullFlex>
            <AuthMain>
                <AuthBoardColumn>
                    <AuthInfoRow>
                        {/* 登录框的左边 */}
                        <span style={{ fontWeight: 'bold' }}>Memos</span>
                        <span>
                            是一个轻量级的、自我托管的备忘录中心。开源和永远免费。
                        </span>
                        <span style={{ fontWeight: 'bold' }}>memos可以做什么？</span>
                        <span>可以成为你的todolist，也可以是你的笔记软件，具有回顾功能。</span>
                    </AuthInfoRow>
                    <AuthInputRow><VeriDivier /></AuthInputRow>
                    <form onSubmit={handleFormSubmit}>
                        <AuthInputRow>
                            {/* 登录框输入框 */}
                            <div>
                                <SpanButton color="green">登录</SpanButton>
                                <SpanButton>/</SpanButton>
                                <SpanButton>注册</SpanButton>
                            </div>
                            <div>
                                <InputBox required onChange={handleNameInput} value={name} name="name" tip='name' placeholder="example@qq.com" />
                            </div>
                            <div>
                                <InputBox required onChange={handlePassInput} value={pass} name="pass" tip='password' placeholder="example" />
                            </div>
                            <div>
                                <Button disabled={submitState.isPending} type="submit" onClick={handleSignInBtnClick}>
                                    <Column>{submitState.isPending && <Spring/>}登录 memos</Column>
                                </Button>
                            </div>
                        </AuthInputRow>
                    </form>
                </AuthBoardColumn>
            </AuthMain>
            <AuthFooter>
                {/* 登录界面底部 */}
            </AuthFooter>
        </FullFlex>
    )
}

export default Auth