import { Button } from "@chakra-ui/react"
import { useConnectWallet} from "@privy-io/react-auth"
import { config } from "src/config/wagmi"
import { useConnect } from "wagmi"
export const CustomConnectButton=()=>{
    const {connect}=useConnect()
    // const {connectWallet}=useConnectWallet()


    function handleWalletConnect(){
        connect({connector:config.connectors[0]})
    }
    return (
        <Button rounded={'full'} onClick={handleWalletConnect}>Connect Wallet</Button>
    )
}