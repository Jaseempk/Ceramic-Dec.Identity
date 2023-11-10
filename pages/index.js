import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {Web3Provider} from "@ethersproject/providers";
import{useRef,useEffect,useSate, useState} from "react";
import Web3Modal from "web3modal";
import { useViewerConnection } from '@self.id/react';
import { EthereumAuthProvider } from '@self.id/web';
import { useViewerRecord } from '@self.id/react';

const inter = Inter({ subsets: ['latin'] })
function RecordSetter(){

  const[name,setName]=useState("");
  const[age,setAge]=useState('');
  const[gender,setGender]=useState("")



  const record=new useViewerRecord("basicprofile");
  console.log("record:",record)
  console.log("record:",record.content)
  const updateRecordProfile=async(name,age,gender)=>{
    await record.merge({
      name:name,
      age:age,
      gender:gender
    });
  }

  return (
    <div className={styles.content}>
      <div className={styles.mt2}>
        {record.content ? (
          <div className={styles.flexCol}>
            <span className={styles.subtitle}>Hello {record.content?.name}!</span>
                {console.log("contents:",record.map(recor=>recor.content?.name))}
            <span>
              The above name was loaded from Ceramic Network. Try updating it
              below.
            </span>
          </div>
        ) : (
          <span>
            You do not have a profile record attached to your 3ID. Create a basic
            profile by setting a name below.
          </span>
        )}
      </div>
  
      Name:<input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.mt2}
      />
        Age:<input
        type="text"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className={styles.mt2}
      />
        Gender:<input
        type="text"
        placeholder="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className={styles.mt2}
      />
      <button className={styles.button} onClick={() => updateRecordProfile(name,age,gender)}>Update</button>
    </div>
  );
}

export default function Home() {

  const[connection,connect,disconnect]=useViewerConnection();

  const web3ModalRef=useRef()
  const getProvider=async ()=>{
    const provider=await web3ModalRef.current.connect()
    const wrappedProvider=new Web3Provider(provider);
    return wrappedProvider;
  }
  //connecting our wallets to 3ID using our EThAuthProvider
  const connectToSelfID = async () => {
    try {
      const ethereumAuthProvider = await getEthereumAuthProvider();
      connect(ethereumAuthProvider);
    } catch (error) {
      if (error instanceof Error && error.message.includes("User Rejected")) {
        // Handle user rejection, show a message or take appropriate action
        console.log("User rejected wallet connection");
      } else {
        // Handle other errors
        console.error("Error connecting wallet:", error);
      }
    }
  };
  
  //first creates a provider and then get signer from that,then address from this signer and the connects your wallet to 3ID using EthereumAUthProvider
  const getEthereumAuthProvider=async()=>{
    const wrappedProvider=await getProvider();
    const signer=wrappedProvider.getSigner();
    const address=await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  }

  useEffect(()=>{
    if (connection.status !=="connected") {
      web3ModalRef.current=new Web3Modal({
        network:"goerli",
        providerOptions:{},
        disableInjectedProvider:false
      })
    }
  },[connection.status])




  return (
    <>
  <div className={styles.main}>
    <div className={styles.navbar}>
      <span className={styles.title}>Ceramic Demo</span>
      {connection.status === "connected" ? (
        <span className={styles.subtitle}>Connected</span>
      ) : (
        <button
          onClick={connectToSelfID}
          className={styles.button}
          disabled={connection.status === "connecting"}
        >
          Connect
        </button>
      )}
    </div>

    <div className={styles.content}>
      <div className={styles.connection}>
        {connection.status === "connected" ? (
          <div>
            <span className={styles.subtitle}>
              Your 3ID is {connection.selfID.id}
            </span>
            <RecordSetter />
          </div>
        ) : (
          <span className={styles.subtitle}>
            Connect with your wallet to access your 3ID
          </span>
        )}
      </div>
    </div>
  </div>
    </>
  )
}
