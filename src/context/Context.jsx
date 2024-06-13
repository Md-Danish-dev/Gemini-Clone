import { createContext, useState } from "react";
import runChat from '../config/gemini'

export const Context=createContext();

const ContextProvider=(props)=>{

    const [input,setInput]=useState("")
    const [recentPrompt,setRecentPrompt]=useState("")
    const [prevPrompt,setPrevPrompt]=useState("")
    const [showResult,setShowResult]=useState(false)
    const [loading,setLoading]=useState(false)
    const [resultData,setResultData]=useState("")

    const delaypara = (index,nextWord) =>{
        setTimeout(function (){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat= ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent= async(prompt)=>{
        
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        setInput("")
        if(prompt!== undefined){
            response =await runChat(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response =await runChat(input)
        }
        
        let responseArray=response.split("**")
        let newResponse="";
        for(let i=0;i<responseArray.length;i++){
            if(i===0 || i%2 !==1){
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        
         let newResponse2=newResponse.split("*").join("<br/>")
         let newResponseArray=newResponse2.split(" ")
            // for typing effect
         for(let i=0;i<newResponseArray.length;i++){
            const nextWord=newResponseArray[i]
            delaypara(i,nextWord+" ")
         }
     
        setResultData(newResponse2)
        setLoading(false)
       
    }

   

    const contextValue={
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        setInput,
        showResult,
        input,
        resultData,
        loading,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;