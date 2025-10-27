// src/components/ZustandTest.jsx
import React, { useEffect } from "react";
import { useTestStore } from "../../store/useTestStore";
import { useAppStore } from "../../store/appStore.js";
import axios from "axios";


export default function TestALLUser() {
        axios.get("http://localhost:2001/test/users").then((res)=>{
              console.log(res);
        })
  return (
   <>
   </>
  )
}
