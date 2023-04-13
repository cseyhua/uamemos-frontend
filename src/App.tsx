import styled from 'styled-components'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import Loading from '@/components/Loading'
import router from '@/router'
import { Full } from '@/layouts'



const FullCenter = styled(Full)`
display:flex;
justify-content: center;
align-items:center;
`;

function App() {

  return (
    <Suspense fallback={
      <FullCenter>
        <Loading />
      </FullCenter>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
