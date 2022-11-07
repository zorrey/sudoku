//import React, { useState, useEffect } from 'react';

const grid = [... Array(9).keys()];
const column = [... Array(9).keys()].map(i => i+1);
const row = ['A','B','C','D','E','F','G','H','I'];
let conflict;
let initial = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let initialSolution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
//let initial = ".................................................................................";
//let initial = "..7.......4..........4.8....3....62..6..2...1752..9.........27...96..518....723.4";
//console.log(row);

function App (){
const [text, setText] = React.useState(initial);
const [locked, setLocked] = React.useState(initial);
const [input, setInput] = React.useState(" ");
const [coord, setCoord] = React.useState(" ");
const [val, setVal] = React.useState(" ");
const [color, setColor] = React.useState("white");
const [gensolution, setGensolution] = React.useState(initialSolution);
const [msg, setMsg] = React.useState([{ valid:"",
                                        conflict:"",
                                        error:"",
                                        solve:""
                                        }]);                                 

 React.useEffect(() => {  
  const timer = setTimeout(() => {
    console.log('This will run after 1 second!')
    setColor("yellow");
  }, 1000);
  return () => clearTimeout(timer);
}, [text]) 
 
const handleInput = (e, col, row) => {
  setInput(e.target.value); 
  setCoord((row+col).trim());
  setVal(e.target.value.trim());   
  handleText(e.target.value, col, row);
  setColor("red");
}

const handleText=(e, col, row) => {  
  console.log("input:", input)
  let temp = text.split("");
  let newText="";
  let index =( row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9) ;
  if( !e ) temp[index]="."
  else temp[index]=e;
  for (let i=0; i<temp.length; i++){
    if(temp[i])
    newText+=temp[i];
    else newText+=".";
  }
  setText(newText); 
}  

const handleTextarea=(e)=>{
console.log(e.target.value);
const[rowCh, colCh, newValue]=findChanged(e.target.value);
setText(e.target.value);
if(!newValue) return;
setCoord((rowCh+colCh).trim());
setVal(newValue.trim());   
}

const findChanged = (newText)=>{
  let index=-1;
  let newValue;
for (let i = 0; i<newText.length; i++){
  if(text[i]!=newText[i]) {
    index=i;
    newValue = newText[i];
  }
  console.log("index, val", index, newValue)
}
let rowCh = String.fromCharCode(Math.floor(index/9) + ("A".charCodeAt(0)))
let colCh = index%9 +1;
return [rowCh, colCh, newValue]
//console.log(rowCh, colCh)
}

const getCoord=(e) => {
  setCoord(e.target.value);
 // console.log(e.target.value)
}  

const getVal=(e) => {
  setVal(e.target.value);
}  
    
/*  const fillCell=(col, row)=>{
  let cell;
  let temp = text.split("");
  let index =( row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9) ;
  cell = temp[index]=="."? " ": temp[index];
  return cell;
};  */

const getChecked = async ()=> {
  setMsg({valid:"",
          conflict:"",
          error:"",
          solve:""})

  const stuff = {"puzzle": text, "coordinate": coord, "value": val}
  let checkdata = await fetch("/api/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
 let checked = await checkdata.json();
 if(checked.error){setMsg(prev => ({...prev, error:checked.error}))}
 if(checked.conflict!=undefined) 
{ conflict = checked.conflict.reduce((acc,el)=>{  acc+= el.toLowerCase()+", ";  return acc;  },"")}
 if(checked.valid!=null)
 setMsg(prev => ({...prev, valid:checked.valid.toString(), conflict: conflict? conflict : ""}))
};

const reload = ()=>{
  setMsg([{ valid:"",
            conflict:"",
            error:"",
            solve:""
        }]);   
  setText(locked);
}

const joker = ()=>{
  setMsg([{ valid:"",
          conflict:"",
          error:"",
          solve:""
        }]);     
  let index =[];
  console.log(text);
  console.log(gensolution);

  let temptext = text.split("");
   for(let i=0; i<text.length; i++){
    if(text[i]!=0 && text[i]!="."){
      if(temptext[i]!=gensolution[i]){
        temptext[i]=gensolution[i];
        index.push(i);
      }
    }else continue;
   }
   let indexArray = index.map(item=>{
    let rowJ = String.fromCharCode(Math.floor(item/9) + ("A".charCodeAt(0)))
    let colJ = item%9 +1;
    return rowJ+colJ
   })
   console.log(indexArray)
   if(indexArray.length>0)
   {setMsg(prev => ({...prev, error: "wrong fields: "+ indexArray.join(", ")}));}
   else setMsg(prev => ({...prev, error: "no wrong fields"}));
  return ;
}

const generate = async (level) =>{

  let l = level;
  console.log("level",level, l)
  const stuff ={"level": l}
  const data = await fetch("/api/generate", {
     method: "POST",
     headers: {
       "Accept": "application/json",
       "Content-type": "application/json"
     },
     body: JSON.stringify(stuff)
   })
    const parsed = await data.json();
   const msgGen = parsed.text;
   const err = parsed.error;
   const genAnswer = parsed.genAnswer; 
   const genSolution= parsed.gensolution; 
   if (err) {
    return setMsg(prev => ({...prev, error: err}));
   }
  
   if(msgGen){
     setMsg(prev => ({...prev, solve: msgGen, error:""}));    
   }     
       console.log("genAnswer", genAnswer)
       console.log("genSolution", genSolution)
  setLocked(genAnswer);
  setText(genAnswer);
  setGensolution(genSolution);
            
    return   
}


const getSolved = async () => {
  const stuff = {"puzzle": text}
 // let doc = document.getElementById("error-msg");
  const data = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  const msgSolved = parsed.text;
  const err = parsed.error;
  const solution = parsed.solution;
  if (err) {
   return setMsg(prev => ({...prev, error: err}));
  }
  if(solution==='true'){
    console.log("truesolve-fillgrid-text :  ", text)
    return setMsg(prev => ({...prev, solve: msgSolved, error:""}));  
  } 
  if(msgSolved){
    setMsg(prev => ({...prev, solve: msgSolved, error:""}));    
  }     
      console.log("solution", solution)
      //setText(solution);
      setText(solution);
     // console.log("solution-text", text)
   return   //fillGrid(solution); 
}

    return(
        <div id="container">                  
            <div id="grid-container">  
            <div id="row">
              <input onClick={()=>generate(1)} type="button" value="Generate L1" id="gen-button1" />    
              <input onClick={()=>generate(2)} type="button" value="Generate L2" id="gen-button2" />   
              <input onClick={reload} type="button" value="Reload" id="gen-reload" />   
              <input onClick={joker} type="button" value="Joker" id="joker" />   
            </div>
            
            <table className="tableLayout">  
            <thead>
               <tr>
                <th>                    
                </th>
                {
                column.map(i=>{
                return <th key={i} className="cell tableCell">
                    {i}
                    </th>
                })      
                }                  
                </tr>     
            </thead>               
            <tbody>
                  {
                row.map((row, index)=>{         
                return <tr key={index}>
                    <td>{row}</td>
                    {  column.map((col, idx) => {
                         return <td key={row+idx} className="tableCell">
                                <input  className={row+col+" grid_input"} 
                                //defaultValue={text[(row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9)] ? text[(row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9)]:" "}
                                onChange ={(e)=>handleInput(e, col, row)}
                                style={{backgroundColor:{color}}}
                                id={row+col}
                                autoComplete="disabled"
                                type="text"
                                size="1"
                                maxLength="1"
                                //placeholder={row+col}
                                placeholder=" "
                                value = {
                                  text[(row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9)]!="."  ? 
                                    text[(row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9)] :
                                    ""}
                                disabled ={locked[(row.charCodeAt(0)-"A".charCodeAt(0))*9 + ((col-1) % 9)]!="." }                                 
                                /> 
                            </td>                                
                        })   
                    }  
                    </tr>                                
                })   
                } 
            </tbody>               
            </table>           
            </div>
          <div id="form">
            <div className="check">
              <form id="check-form">
              <div id="buttons">
                <div id="solve" > 
                  <input onClick={getSolved} type="button" value="Solve" id="solve-button" />  
                  <p id="solve-msg" > ---            
                  <span>{msg.solved==""? "": msg.solve}---</span></p> 
                </div>
              </div> 
                
              <div  id="error-msg">              
                  <p  className="input">error: 
                  <span> {msg.error? msg.error : 
                          msg.solve? "": "---"}</span></p>
                </div>  
              <div id="check">
                <input onClick={getChecked} type="button" id="check-button" value="Check"/>              
                <p className="input">Coordinate (A1): 
                    <input onChange={(e)=>getCoord(e)} value={coord} id="coord" className="checker" type="text" name="coordinate"/>
                </p>
                <p className="input">Value (1-9): 
                    <input onChange={(e)=>getVal(e)} value={val} className="checker" type="text" id="val" name="value"/>
                </p>
                <div id="error" >
                  <p className="input"> "valid":  <span> {msg.valid? msg.valid : ""} </span></p> 
                  <p className="input">"conflict":<span> {msg.conflict? msg.conflict : "no conflict"} </span></p>  
                </div>
              </div>                     
              </form>             
            </div>
            <div className="check">
              <form id="text-form">           
              <textarea
                  value={text}
                  onChange={(e)=>handleTextarea(e)}
                  //defaultValue={text}
                  cols="85"
                  id="text-input"
                  name="puzzle">                    
              </textarea>
                  <br />               
              </form>  
            </div>    
            
          </div>  
            
        </div>
    )
}    //end App

ReactDOM.render(<App/>, document.getElementById("root"));