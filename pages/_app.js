import '@/styles/globals.css'
import{Provider} from "@self.id/react"

export default function App({ Component, pageProps }) {
  return(

  <Provider client={{ceramic:"testnet-clay"}}>
    return <Component {...pageProps} />
  </Provider>
  )
}
