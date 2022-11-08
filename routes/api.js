'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const SudokuGen = require('../controllers/sudoku_generator.js');
//const matrixCreator = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  let gen = new SudokuGen();
    
app.route('/api/check')
    .post((req, res) => {
      if(!req) return res.json({ error: 'Required field(s) missing !' });
      console.log("req.body - check:", req.body);
      const {puzzle, coordinate, value} = req.body;
      let conflict = [];      
      
      if(!puzzle || !coordinate || !value){ return res.json({ error: 'Required field(s) missing' }) ;} 
      if(!solver.validate(puzzle)) return res.json({ error: 'Expected puzzle to be 81 characters long' });
      if(!solver.validChar(puzzle)){ return res.json({ error: 'Invalid characters in puzzle' }); }
      if(!solver.checkCoord(coordinate))return res.json({error: 'Invalid coordinate'});
      if(!solver.validValue(value)) return res.json({error: 'Invalid value'});

      let row = solver.returnCoord(coordinate).row;
      let col = solver.returnCoord(coordinate).col;
      let valid = ( solver.checkRowPlacement(puzzle, row, col, value) && 
                    solver.checkColPlacement(puzzle, row, col, value) && 
                    solver.checkRegionPlacement(puzzle, row, col, value) )

    if(!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflict.push('row');  
      console.log('conflict', conflict)  ; 
    }
    if(!solver.checkColPlacement(puzzle, row, col, value)) {
      conflict.push('column');
    }
    if(!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflict.push('Region');
    }

    console.log("checkResult: ",{'valid': valid , 'conflict': conflict} )
    return res.json({'valid': valid , 'conflict': conflict})  

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      console.log('req.body: ', req.body);
      if(!puzzle) { 
        console.log('error: Required field missing' );
        return res.json({error: 'Required field missing' });     
      }
      if(!solver.validate(puzzle)) { 
        console.log(' error: Expected puzzle to be 81 characters long ' );
        return res.json({ error: 'Expected puzzle to be 81 characters long' });     
      }
      if(!solver.validChar(puzzle)) { 
        console.log( 'error: Invalid characters in puzzle'  );
        return res.json({ error: 'Invalid characters in puzzle' });     
      }
      let answer = solver.solve(puzzle);
      let numberSolutions = solver.getNumberSolutions(solver.matrixCreator(puzzle));
      //console.log('solver.solve(puzzle): ', solver.solve(puzzle))
      //console.log('answer: ', answer)
      if(!answer) {
        console.log("cannot be solved!!!")
        return res.json({ error: 'Puzzle cannot be solved' });
      } else{
        console.log('solved!');
        console.log('numSol', numberSolutions);

       if(answer === true) return res.json({ solution: 'true', text: "already solved!" });
       return res.json({solution: answer, text: "valid sudoku puzzle!", numberSolutions: numberSolutions});
      }
    });
  app.route('/api/generate')
    .post((req, res) => {
      console.log('req.body: ', req.body);
      let level=req.body.level;
      const {genAnswer , gensolution}= gen.creator(level);
      console.log("gensolution", gensolution);
      console.log("genAnswer", genAnswer);
      if(!genAnswer)  return res.json({ error: 'Error when generating sudoku.' });
      return res.json({genAnswer: genAnswer, text: "generated!", gensolution: gensolution});
    });
};
