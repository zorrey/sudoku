class SudokuGenerator {
    
}
module.exports = SudokuGenerator;const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();
let initial = [
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0]
]
//-------------------------------------------------------------------------------------------------------------------------------------
class SudokuGen {

  countReg(str, row, column){
    let matrix = [...solver.matrixCreator(str)];
    let rStart= row - row % 3;
    let cStart= column - column % 3;
    let count=0;
    for(let i=rStart; i < rStart+3; i++){
      for(let j=cStart; j < cStart+3; j++) {
      if(matrix[i][j]!==0 && matrix[i][j]!=='.')  count++;     
      }
    } 
    return count;
  }

  countRow(str,row){
    let matrix = [...solver.matrixCreator(str)];
    let count=0
      for(let c=0; c<9; c++){
        if(matrix[row][c]!==0 && matrix[row][c]!=='.'  ){
          count++;
        }
      }
    return count;
  }

  countCol(str,column){
    let matrix = [...solver.matrixCreator(str)];
    let count=0
    for(let r=0;r<9;r++){
      if(matrix[r][column]!==0 && matrix[r][column]!=='.'){
        count++;
      }
    }
    return count;
  }

   checkInputPuzzle(data){
      for (let i=0; i<9; i++){
        for(let j=0; j<9 ; j++){
          if(data[i][j]!=0){
            let num = data[i][j];
            let row = i;
            let col = j;
            data[i][j]=0;
           // console.log('row, col, num', row, col, num)
           // console.log('isUnique', this.isUnique(data, row, col,num))
            if(solver.isUnique(data, row, col, num)==false) {
              return false; 
            }
            else data[i][j]=num;
        }
        
        }
      }
      return true;
    }
    
 matrixGen() {
  //let j=0;
  let filled;
  let initialData = [... initial];
  //if(num>= 81) return console.log("error");
    let ranNum = Math.floor(Math.random()*9+1);
    //console.log('randomN', ranNum);
    initialData[0][0] = ranNum;
    initialData[4][1] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[4][1]);
    initialData[6][2] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[6][2]);
    initialData[3][3] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[3][3]);
    initialData[8][5] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[8][5]);
    initialData[1][4] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[1][4]);
    initialData[2][6] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[2][6]);
    initialData[5][7] = Math.floor(Math.random()*9+1);
    //console.log('randomN', initialData[1][4]);
    initialData[7][8] = Math.floor(Math.random()*9+1);
  

    return solver.solve(solver.stringReturn(initialData));
  }

 /*  joker(puzzle, workPuzzle, solution){
    
  } */

  creator(level){
    let str = this.matrixGen();

    if(typeof str == "string"){
      let dataM = str.split("");
    console.log("str: ",str)

  /*     for(let i =0;i<81;i++){
        let idx = Math.floor(Math.random()*81);
        //console.log(idx)
        let temp = dataM[idx];
        dataM[idx]=0;
        //console.log("data", dataM);
        //console.log("data-solution", solver.getNumberSolutions(solver.matrixCreator(dataM.join(""))));
        if(solver.getNumberSolutions(solver.matrixCreator(dataM.join("")))>1){ 
          dataM[idx] = temp;
          break;
        }
      }  */ 
  let i=0;
  let temp;
  let idx =-1;
      while(solver.getNumberSolutions(solver.matrixCreator(dataM.join("")))<2 && i<81){
        idx = Math.floor(Math.random()*81);
        //console.log(idx)
        temp = dataM[idx];
        dataM[idx]=0;
        //console.log("data-solution", solver.getNumberSolutions(solver.matrixCreator(dataM.join(""))));
        i++;
      }

      dataM[idx] = temp;
      console.log("data-solution", dataM.join(""));
      for(let j=0;j<81;j++){        
        if(dataM[j]!==0){
          if(level==1){
               if(this.countReg(dataM.join(""), Math.floor(j/9), j%9)>4 && this.countRow(dataM.join(""), Math.floor(j/9))>3 && this.countCol(dataM.join(""), j%9)>3){
           // console.log("j,Math.floor(j/9),j%9",j,Math.floor(j/9),j%9)
            temp = dataM[j];
            dataM[j]=0;
          if(solver.getNumberSolutions(solver.matrixCreator(dataM.join("")))>1){
            dataM[j]=temp;
          }else continue;  
          } else continue;   
          }
          else if(level==2){
            if(this.countReg(dataM.join(""), Math.floor(j/9), j%9)>3 && this.countRow(dataM.join(""), Math.floor(j/9))>2 && this.countCol(dataM.join(""), j%9)>2){
              // console.log("j,Math.floor(j/9),j%9",j,Math.floor(j/9),j%9)
               temp = dataM[j];
               dataM[j]=0;
             if(solver.getNumberSolutions(solver.matrixCreator(dataM.join("")))>1){
               dataM[j]=temp;
             }else continue;  
             } else continue;   
          }          
        }
      }

      //console.log("data", dataM);
      console.log("data-solution", dataM.join(""));
      console.log("number-solution", solver.getNumberSolutions(solver.matrixCreator(dataM.join(""))));

      let genAnswer = dataM.map(el=>{return el==0? el=".": el}).join("");
    // data[col][row]=num;
    console.log("genAnswer, str",genAnswer,str)
      return {
        genAnswer: genAnswer,
        gensolution: str
      }

    }

  }
}
let gen = new SudokuGen;
/*
let matr = gen.matrixGen();
console.log("matr", matr);
 
  let str = solver.stringReturn(matr);
console.log("str",str);*/
//console.log("gen-creator",gen.creator()); 

module.exports = SudokuGen;