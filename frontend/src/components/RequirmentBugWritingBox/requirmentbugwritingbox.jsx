import React, { useState } from "react";
import './requirementbugwriting.css';
import { useNavigate } from "react-router-dom";
import Layout from "../PageLayouts/pagelayout";




const RequirementWriting = () => {
  const [requirements, setRequirements] = useState('');
  const[error,setError]= useState('')
  const[apierror,setApiError] =useState('')
  
//for using routing 
const navigate = useNavigate();

  const handleRequirement = async (e) => {
    e.preventDefault();

    //Basic validation:If nothing is entered in the box, an error will be returned. 
    if(!requirements){
        setError('Please enter the user requirement or describe the bug');
        return;
    }

    //Collecting the written requirment or bug into a variable called requirmentdata

    const requirementdata = {requirementdata:requirements}

    //Passing the information to Nodeserver

    try {

        const response= await fetch ('http://localhost:5000/api/requirementbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requirementdata),

      });

      const data = await response.json();
      console.log (data);
  navigate('/requirementpage', {
    state: {
      requirement: data.requirement,
      acceptanceCriteria: data.acceptanceCriteria
    }
  });

    
} catch (error) {
    console.log(error)
    setApiError ('An error occured while adding your input pleae try again ')

        
    }

    
  };

  return (
    <Layout>
    <div className='requirmentbugwritingbox'>
        <h1>Description</h1>
         {/* Form for entering a requirement or bug description */}
      <form className='requirmentform' onSubmit={handleRequirement}>
        <input
          type="text"
          name="requirements"
          placeholder="Please enter the user requirement or describe the bug"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          required

          
        />
        <button type="submit">Add</button>
      </form>
      {/* Display error message if a validation error exists */}
      {error && <div className="error-message">{error}</div>}
      {/* Display error message if a Api error exists */}
      {apierror && <div className="api_error">{apierror} </div>}
      

    </div>
    </Layout>
  );
};

export default RequirementWriting;