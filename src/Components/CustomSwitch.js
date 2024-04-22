import React, {Children } from 'react';



export const CustomSwitch = ({children, value}) => {
  const cases = [];
  const defaults = [];
  Children.forEach(children, (e) => {
    if(e.type.name === "CustomCase"){
      if(typeof e.props.value === 'function'){
        if(e.props.value(value)){
          cases.push(e);
        }
      }else if(value === e.props.value){
        cases.push(e);
      }
    }else if (e.type.name === "DefaultCase"){
      defaults.push(e);
    }
  });
  
  if(cases.length > 0){
    return cases;
  }else{
    return defaults;
  }
};

export const CustomCase = ({children}) => {
  return <>{children}</>;
};

export const DefaultCase = ({children}) => {
  return <>{children}</>;
}

