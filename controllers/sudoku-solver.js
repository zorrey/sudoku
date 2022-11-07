
//
//let solutions =new Set();
//let solutions =[];

class SudokuSolver {
  
  validate(puzzleString) {
    if(puzzleString.length != 81)
    return false;
    else return true;
  }
  validChar(puzzleString){
    if((/[^1-9.]/g.test(puzzleString))) 
      return false;
    return true;
  }
  validValue(value){
    if(!value) return false;
    if(value.toString().length != 1) return false;
    if(/[^1-9]/.test(value)) return false;
    if(parseInt(value)<1 || parseInt(value)>9) return false;
    return true;
  }
  isCellVoid(matrix) {
    let cells = {isMatrixFull: true, row: -1, col:-1};
    //let matrix = this.matrixCreator(puzzleString);
    //console.log(matrix);
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
          if(matrix[i][j]==0){
            cells.row = i;
            cells.col =j;
            cells.isMatrixFull = false;
            break;
          }
        }
       if(!cells.isMatrixFull)
        break ; 
    }
    return cells;
  }

  checkCoord(coord){
    if(coord.length != 2) return false;
    let co = coord.split("");
    if(/[^A-Ia-i]/.test(co[0])) return false;
    if(/[^1-9]/.test(co[1])) return false;
    return true;
  }

  returnCoord(coord){
    if(!this.checkCoord(coord)) return false;

    let co = coord.split("");
    let rowNumber = { A: 1,
                      B: 2,
                      C: 3,
                      D: 4,
                      E: 5,
                      F: 6,
                      G: 7,
                      H: 8,
                      I: 9 }
    let rowLetter = co[0].toUpperCase();
    console.log('{row: rowNumber[row]-1, col: co[1]-1}', {'row': rowNumber[rowLetter]-1, 'col': parseInt(co[1])-1})
    return  {row: rowNumber[rowLetter] - 1, col: parseInt(co[1]) - 1};
  }

  checkRowPlacement(puzzleString, row, column, value) {
   if(row==undefined || column==undefined || !this.validValue(value) || !puzzleString) return false;
    let matrix = [...this.matrixCreator(puzzleString)];
   
          //console.log('matrix', matrix);
          //console.log('row', matrix[row]);

    for(let j=0; j<9; j++){
      if(j != column){
        //console.log('j, row, col: ', j , row , column)
        if(matrix[row][j]== parseInt(value)){
          //console.log('matrix[row][j]== parseInt(value), valu, el==value: ', matrix[row][j]== parseInt(value))
          return false;          
            }           
          }        
        }    
      return true;
      }

  checkColPlacement(puzzleString, row, column, value) {
    if(row==undefined || column==undefined || !this.validValue(value) || !puzzleString) return false;
    let matrix = [...this.matrixCreator(puzzleString)];
    for (let i=0; i<9; i++){
      if(i!=row){
        if(matrix[i][column] == value) return false;
      }
    }
    return true;
  }
  
  checkRegionPlacement(puzzleString, row, column, value) {
    if(row==undefined || column==undefined || !this.validValue(value) || !puzzleString) return false;
    let matrix = [...this.matrixCreator(puzzleString)];
    let rStart= row - row % 3;
    let cStart= column - column % 3;
    for(let i=rStart; i < rStart+3; i++){
      for(let j=cStart; j < cStart+3; j++) {
        if(i!=row || j!=column){
          if (matrix[i][j]==value) return false;
        }        
      }
    } 
    return true;
  }
/*   checkSum(matrix){
    let valid = true;
    for(let i=0; i<9; i++){
      let sum = matrix[i].reduce((sum, item)=>{
                        sum += item;
                         },0) ;
      if(sum != 45) {
        valid = false;
        break;
       }                    
      }
      for( let j=0; j<9; j++ ){
        let sum=0;
        for(let i=0; i<9; i++){
        sum += matrix[i][j];
        }
        if(sum!=45){
          valid = false;
          break;
        }
      }
      for(let i=0; i<9; i+=3){
        for(let j=0; j<9; j+=3){
          let sum=0;
          for(let r=i; r<i+3; r++){
            sum += matrix[r].reduce((acc, item)=>{
              acc += item;
            },0)
          }
          if(sum != 45){
            valid = false;
            break;
          }
        }
      }
      return valid;
    } */ //end checkSum

    checkInputPuzzle(puzzleString){
      let data = [...this.matrixCreator(puzzleString)];
      for (let i=0; i<9; i++){
        for(let j=0; j<9 ; j++){
          if(data[i][j]!=0){
            let num = data[i][j];
            let row = i;
            let col = j;
            data[i][j]=0;
           // console.log('row, col, num', row, col, num)
           // console.log('isUnique', this.isUnique(data, row, col,num))
            if(this.isUnique(data, row, col, num)==false) {
              return false; 
            }
            else data[i][j]=num;
        }
        
        }
      }
      return true;
    }


  isUnique(matrix, row, col, num){
    //check row
    for(let j=0; j<9; j++){
      if (matrix[row][j]==num)
      return false;
    };
    //check column
    for(let r=0;r<9;r++){
      if (matrix[r][col]==num)
      return false;
    };
    //check square
    let rStart= row - row % 3;
    let cStart= col - col % 3;
    for(let i=rStart; i < rStart+3; i++){
      for(let j=cStart; j < cStart+3; j++) {
        if (matrix[i][j]==num) return false;
      }
    } 
    //if no instanses of num found
    return true;
  }

  solveSudoku(matrix) {   
    //let flag = true;
    let row = this.isCellVoid(matrix).row;
    let col = this.isCellVoid(matrix).col;
    if(this.checkInputPuzzle(this.stringReturn(matrix)) == false){return false};
    if(matrix==[] || !matrix) return false;
    //if(!this.checkInputPuzzle(matrix)) return false;

    if(this.isCellVoid(matrix).isMatrixFull) return true;    
    
    for(let num = 1; num <= 9; num++){

      if(this.isUnique(matrix, row, col, num)){
       
        //when unique in row, column and square assign the cell to the number
        matrix[row][col] = num;
        
        //if all other empty cells are filled and valid: sudoku is solved
        if(this.solveSudoku(matrix)){

          return matrix;
        }        
        //else cell is back to zero and num is changed to the next option
        else 
          matrix[row][col] = 0;      
        }  
        if(this.checkInputPuzzle(this.stringReturn(matrix))) continue
        else return false;
    }    
    return false;    
  }
/*   solutionNumberSudoku(matrix) {  
   //console.log(this.stringReturn(matrix)) ;
    if(!this.checkInputPuzzle(this.stringReturn(matrix))) return false;
    if(this.isCellVoid(matrix).isMatrixFull) {
      //console.log(true, this.stringReturn(matrix));
      return true;
    }
      for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
          if(matrix[i][j]==0){
            for(let num = 1; num <= 9; num++){
              if(this.isUnique(matrix,i,j,num)){
                let newM = [... matrix];
                //console.log("newM",this.stringReturn(newM)) ;
                newM[i][j]=num;
               // console.log(`newM + num-${num}-[${i};${j}]`, this.stringReturn(newM)) ;
                if(this.solutionNumberSudoku(newM)===true){
                  //console.log(this.stringReturn(newM))
                  solutions.push(this.stringReturn(newM));
                  continue;
                }else{
                  newM[i][j]=0;                  
                }
           
              }      
            
            } 

           return solutions;      
          }          
        }
      }
        
  } */

  getNumberSolutions(data){
  let solutions=[];
  if(!this.checkInputPuzzle(this.stringReturn(data))) return -1;
 const solutionNumberSudoku = (matrix) =>{  
    //console.log(this.stringReturn(matrix)) ;
     if(!this.checkInputPuzzle(this.stringReturn(matrix))) return false;
     if(this.isCellVoid(matrix).isMatrixFull) {
       //console.log(true, this.stringReturn(matrix));
       return true;
     }
       for(let i=0;i<9;i++){
         for(let j=0;j<9;j++){
           if(matrix[i][j]===0){
            //console.log(i,j,matrix[i][j])
             for(let num = 1; num <= 9; num++){
               if(this.isUnique(matrix,i,j,num)){
                 let newM = [... matrix];
                 //console.log("newM",this.stringReturn(newM)) ;
                 newM[i][j]=num;
                // console.log(`newM + num-${num}-[${i};${j}]`, this.stringReturn(newM)) ;
                 if(solutionNumberSudoku(newM)===true){
                   //console.log(this.stringReturn(newM))
                   if(newM)
                   {solutions.push(this.stringReturn(newM));
                   continue;}
                   
                 }else{
                   newM[i][j]=0;                  
                 }
            
               }      
             
             } 
 
            return solutions;      
           }    

         }
       }
       return solutions;      
   }
   //return solutionNumberSudoku(data).length;
   let answer = solutionNumberSudoku(data);
   if(answer===true) return 0;
   return answer.length;
}
solve(puzzleString){
  
if(!this.validate(puzzleString) || !this.validChar(puzzleString) || !this.checkInputPuzzle(puzzleString)) return false
  let matrix = [...this.matrixCreator(puzzleString)];
  let datapuzzle = this.solveSudoku(matrix);
  //console.log('matrix', matrix)  

  if(datapuzzle) {
  if(datapuzzle == true) return true;
    console.log(this.stringReturn(datapuzzle))
    return this.stringReturn(datapuzzle);
  }
    else return false;
}
matrixCreator(puzzleString){
  //if (puzzleString.length !== 81) return null;
  let arr = puzzleString.split("");
  let newMatrix=[];

  for ( let row=0; row<9; row++){
    newMatrix[row]=[];   
    for(let col=0; col<9; col++){
    if(arr[0]=='.'){
      newMatrix[row][col] = 0;
      arr.shift();
    } else
      newMatrix[row][col] = parseInt(arr.shift());      
    }
  }   
  return newMatrix;
}

stringReturn(datapuzzle){
  //console.log('datapuzzle', datapuzzle)
  if(typeof datapuzzle==="string"|| typeof datapuzzle==="boolean"){
    return datapuzzle;
  }
  let returnstr = datapuzzle.reduce((acc, item) =>{
   item = [...item.map(el => {
      if(el == 0) el = '.';
       return el;
    })]
    acc += (item.join(''));
    return acc;
  }, [])
  return returnstr
}
}
/*   let solver = new SudokuSolver;
  let str=".....5.1.85.4....243.......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
let grid = solver.matrixCreator(".....5.1.85.4....243.......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..");
//let solution = solver.getNumberSolutions(grid);
//console.log("solver.solutionNumberSudoku",  solution);  
console.log("solver.checkInputPuzzle",  solver.checkInputPuzzle("997235418851496372432178956174569283395842761628713549283657194516924837749381625"));  
console.log("solver.getNumberSolution",  solver.getNumberSolutions(solver.matrixCreator('967235418851496372432178956174569283395842761628713549283657194516924837749381625')));  
 */

module.exports = SudokuSolver;