import React,{useState} from 'react';
import {pinFile} from "./Utils/IPFS.js"



const LoadContractDocumentation = () =>{
 const [filePath,setFilePath] = useState(undefined)
 const [myBuffer,setMyBuffer] = useState(undefined)
 const [myReader,setMyReader] = useState(undefined)

 const handleChange = async(event) => {
    event.preventDefault()
    // const reader = new window.FileReader()
    // reader.readAsArrayBuffer(event.target.files[0])
    // reader.onloadend = () => {
    //     setMyReader(Buffer(reader.result))
    //  }

   

    setFilePath(event.target.files[0])

    }

const streamFiles = async (file) => {
        // Create a stream to write files to
        const stream = new ReadableStream({
          start(controller) {
            //for (const file of files) {
              // Add the files one by one
              controller.enqueue(file)
            //}
    
            // When we have no more files to add, close the stream
            controller.close()
          }
        })
        return stream
    }


 const handleUpload = async (event) => {
     event.preventDefault()

    console.log(filePath);
     const result = streamFiles(filePath)
     console.log("streamFiles result:", result);
     const pin = await pinFile(result)
     console.log("pin Result:" , pin);

     //const result = await pinFile(myReader)
     //console.log(result);
 }

    return(
    <div className="container m-3">
        <div className="mb-3">
            <label htmlFor="formFileSm" className="form-label" >Default file input example</label>
            <input className="form-control" type="file" id="formFile" onChange={(event) => handleChange(event)}/>
            <a className='btn btn-primary' onClick={(event) => handleUpload(event)}>Upload!</a>

</div>
        your your IPFS Hash: yada
    </div>
    )
}

export default LoadContractDocumentation