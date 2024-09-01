import React,{useState} from "react";
import "./JobDesc.css"
const JobDesc=({onSubmit, jobDesc, setJobDesc, generateResumeAnalysis})=>{
    
    const [error, setError] = useState("");

  const handleSubmit = (event) => {
    if (!jobDesc.trim()) { 
      setError("Please enter the job description before submitting.");
      return;
    }
    generateResumeAnalysis(event);
    onSubmit(); // Proceed to the next step
  };

    
    return(
        <div className="outerScreen">
            <form method="POST" onSubmit={generateResumeAnalysis} className="jobDesc">
            
                
                <textarea 
                type="text"
                placeholder="Enter job description of job you want to apply for"
                name="jobDesc"
                value={jobDesc}
                onChange={(e) => {setJobDesc(e.target.value)
                                    setError("");}
                }
                />
                <button type="submit" id="descbtn" onClick={handleSubmit}>
                Submit
            </button>
             
             </form>
            
            {error && <p className="error">{error}</p>}

        </div>
    );

}

export default JobDesc;
