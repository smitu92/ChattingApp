// import axios from "axios";
// import { useState } from "react"

import { useEffect } from "react";
import { useState } from "react"

// export default function Profile() {
//     const [file, setFile] = useState({
//          name:null,
//          size:null,
//          timeUploaded:null,
//          prevUrl:null
//     });
//    async function onPrev(e) {
//         e.preventDefault()
//         const f=e.target.files[0];
//         const form=new FormData();
//         form.append("file",f);
//        const res=await axios.post("http://localhost:2001/upload/image",form);
    
//         console.log(res);
//         if (res.status) {
//             console.log("it is done in a way");
//         }
//         console.log(e);
//         console.log(e.target.files)
//         const fname = f.name;
//         const size = f.size;
//         console.log(size,fname);
//         const prevUrl= URL.createObjectURL(f);
//         console.log(prevUrl);
//         setFile({
//              name:fname,
//              size:size,
//              prevUrl:prevUrl,
//              timeUploaded:e?.timeStamp
//         });

//     }
//     function onUpload(e) {
//         console.log(e.target.value);        
//         console.log(e);
//         console.log(e.target.name);
//     }
//     return (
//         <div className="flex flex-col justify-center items-center h-screen w-screen" id="container">

//             <div className="lg:max-w-[1000px] lg:max-h-[1000px]bg-cyan-200 md:max-w-[720px] md:max-vh-[80%] vw-full h-full lg:w-[500px] lg:h-[500px]">
//                 <form action="">
//                     <input type="file" name="image" id=""
//                         onChange={(e) => onPrev(e)} />
//                     <button onClick={onUpload}>click to upload</button>
//                 </form>
//             </div>
//             {file && <div className="w-[520px] h-[520px]">
//                 <div className="w-1/12 h-1/12 ">
//                     <span className="font-serif font-bold text-purple-500 ">{file.size}</span>
//                     <span className="font-serif font-bold text-purple-500 text-2xl">{file.name}</span>
//                 </div>
//                 <img src={file.prevUrl} alt="image che baka" className="w-[500px] h-[500px]" />
//             </div>
//             }

//         </div>

//     )
// }



// export default function Profile() {
//      return(
//      <div className="lg:w-[800px] lg:h-[800px] w-screen h-screen flex justify-center items-center">
      
//                <Picture />


//      </div>)
// }


function Picture() {
    const [isOpen,setIsOpen]=useState(false);
    const [isChangePic,setIsChangePic]=useState(false);
    const [url,setUrl]=useState(null);
    const OnClick=(e)=>{
                console.log(e.target.files[0])
                const f=e.target.files[0];
                setUrl(URL.createObjectURL(f));
                setIsOpen(true);
    }
    return(<div className="lg:w-[350px] lg:h-[350px] flex justify-center items-center max-w-screen max-h-screen flex-col gap-4">
            <img src="https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg" alt="" 
            className="lg:w-[200px] lg:h-[200px] w-screen h-[100px]"/>
            {isChangePic && <input type='file' onChange={OnClick} />}
            <button onClick={()=>setIsChangePic(true)} className="bg-lime-200 hover:bg-cyan-800 border-2 ">Edit</button>
           {isOpen && <PrevOnupdate setIsChangePic={setIsChangePic} setIsOpen={setIsOpen} url={url} />}

    </div>)
}

function PrevOnupdate({url,setIsChangePic,setIsOpen}) {
      const handleConfirmation=()=>{
                     setIsOpen(false)
                    setIsChangePic(false);
                   
      }     
       return(
      <div className="absolute z-30 w-[400px] h-[400px] ">
                <img src={url} alt="" className="lg:w-[200px] lg:h-[200px] w-screen h-[100px]"/>
                <button onClick={handleConfirmation} className="bg-lime-200 hover:bg-cyan-800 border-2 ">Confirm</button>
      </div>)
}

