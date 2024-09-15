
import { useState} from "react"
function App() {
  const [value,setValue]=useState("")
  const [error,setError]=useState("")
  const [chatHistory,setchatHistory]=useState([])

  const supriseOptions=[
    'Who won the latest Novel Peace Prize',
    'Where does pizza come from',
    'Who do make a blt pizza'
  ]
  const suprise=()=>{
    const randomvalue=supriseOptions[Math.floor(Math.random()*supriseOptions.length)]
    setValue(randomvalue)
  }

  const getResponse=async ()=> {
    if(!value){
      setError("Error! Please ask a question")
        return
    }
    try{
      const options={
        method: 'POST',
        body:JSON.stringify({
          history:chatHistory,
          message:value
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini',options)
      const data=await response.text()
      console.log(data)
    }catch(error){
      console.error(error)
      setError("Something went wrong! Please try again later.")
    }
    
  }
  return (
    <>
      <div className="app">
        <p>Whta fo you want
          <button className="suprise" onClick={suprise} disabled={!chatHistory}>Suprise Me</button>
        </p>
        <div className="input-container">
          <input value={value} type="text" placeholder="Enter your Question" onChange={(e)=>setValue(e.target.value)} />
          {!error && <button onClick={getResponse}>Ask Me</button>}
          {error && <button>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          <div key={""}>
            <p className="answer">

            </p>
          </div>
        </div>

      </div>
    </>
  )
}
export default App
