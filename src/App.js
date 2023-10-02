import "./styles.css"
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS ={
  ADD_DIGIT :'add-digit',
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : 'clear',
  DELETE_DIGIT : 'delete-digit',
  EVALUATE : 'evaluate'
}
function reducer(state, {type , payload}){
 
  // eslint-disable-next-line default-case
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperend:payload.digit,
          overwrite:false
        }
      }
      if (payload.digit === "0" && state.currentOperend=== "0") {return state}
      if (payload.digit === "." && state.currentOperend.includes(".")) {return state}

      return{
        ...state,
        currentOperend : `${state.currentOperend || ""}${payload.digit}`,
      }
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperend == null && state.previousOperand == null){
          return state
        }
        if (state.previousOperand == null){
          return{
            ...state,
            operation:payload.operation,
            previousOperand:state.currentOperend,
            currentOperend:null,
          }
        }
        if (state.previousOperand==null) {
          return{
            ...state,
            operation:payload.operation,
            previousOperand:state.currentOperend,
            currentOperend:null
          }
        }
        return {
          ...state,
          previousOperand:evaluate(state),
          operation:payload.operation,
          currentOperend:null,
        }
      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite){
          return{
            ...state,
            overwrite:false,
            currentOperend:null
          }
        }
        if (state.currentOperend==null)return state
        if(state.currentOperend.length ===1){
          return {
            ...state,
            currentOperend:null
          }
        }
      // eslint-disable-next-line no-fallthrough
      case ACTIONS.EVALUATE:
        if(
          state.operation == null ||
          state.currentOperend ==null ||
          state.previousOperand ==null
        ){
          return state
        }
        return {
          ...state,
          overwrite:true,
          previousOperand:null,
          operation: null,
          currentOperend:evaluate(state)

        }

  }

}
function evaluate({ currentOperend, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current =parseFloat(currentOperend)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation =""
  // eslint-disable-next-line default-case
  switch (operation) {
  case "+":
    computation=prev + current
    break
  case "-":
    computation=prev - current
    break
   
  case "*":
      computation=prev * current
      break
  case "÷":
      // eslint-disable-next-line no-unused-vars
      computation=prev / current
      break
 }
 return computation.toString() 
}
const INTEGER_FORMATTER =new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})
function formatOperand(operend){
  if (operend == null) return
  const [integer, decimal] = operend.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperend, previousOperand, operation}, dispatch]= useReducer(reducer, {})
  
  return (
    <div className="calculator">
      <div className="output">
        <div className="pre-operend">{previousOperand} {operation}</div>
          <div className="cur-operend">{formatOperand(currentOperend)}</div>
        </div>
      <button className="span-two" onClick={() =>dispatch({type: ACTIONS.CLEAR})}>
        AC
        </button>

      <button onClick={() =>dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation ="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() =>dispatch({type: ACTIONS.EVALUATE})}>=</button>
</div>
  );
}

export default App;
