from datetime import datetime
from langchain import PromptTemplate

def generate_deadline_management_prompt(today, task_dict):
    prompt_template = f"""
    The following is a list of tasks and their deadlines, in the format {{"heading": ["description", "duedate", "type", "color"]}}, tasks: {{
    {task_dict}
    }}

    Each task includes a heading, description, duedate, type, and color. Considering all these tasks, generate a detailed plan that helps the user complete them productively without missing any due dates. The plan should focus on:

    Task Ordering: Determine the order in which tasks should be completed based on their type and due dates.
    Methodology:
    Prioritization: Prioritize tasks by their type (e.g., personal, work, study) and due dates.
    Task Breakdown: Break down larger tasks into smaller, manageable sub-tasks if necessary.
    Execution: Provide a step-by-step method for tackling each task, ensuring productivity and efficiency.
    Provide the user with a clear and actionable plan that includes:

    A prioritized list of tasks with an explanation for their order.
    Specific steps for breaking down and completing each task.
    Any additional tips for maintaining focus and managing time effectively.

    Today's date: {today}

    Give the answer in plain text instead of markdown format.
    """
    return prompt_template

def vidPrompt():
    prompt = """
Analyze the video interview and provide a detailed description of the interviewee's performance. 
The analysis should include the following parameters, each measured out of 10:

1. Vocabulary: Assess the range and appropriateness of terms used by the interviewee.
2. Confidence Level: Evaluate the interviewee's steadiness, tone, and lack of hesitation.
3. Engaging Ability: Determine how well the interviewee captures and maintains the audience's attention.
4. Speaking Style: Review the clarity, coherence, and expressiveness of the interviewee's speech.

Provide the output in the following JSON format with a text review summarizing the interviewee's performance:

{
  "video_analysis": {
    "vocabulary": 0,
    "confidence_level": 0,
    "engaging_ability": 0,
    "speaking_style": 0,
    "overall_average": 0,
    "review": ""
  }
}

Additionally, calculate an overall average score using a weighted average, where the weights are based on the importance of the four parameters being tested.
"""
    return prompt


def summ_prompts():
    llm_prompt_template = """Summarize the following text in a concise manner while highlighting key concepts, definitions, and important takeaways. Organize the summary into bullet points or short paragraphs that emphasize understanding and retention. If applicable, include examples, mnemonics, or analogies that can aid in learning. Finally, suggest any related topics or questions that the student should explore to deepen their understanding.
    "{text}"
    SUMMARY:"""
    llm_prompt = PromptTemplate.from_template(llm_prompt_template)
    return llm_prompt



def roadmap_prompt(domain,today):
    prompt=f"""
I want to become an expert in {domain} within a year. Currently, I am a beginner, and it is {today} today. Please provide a detailed, step-by-step, task-based roadmap that spans the entire year, starting from today, to help me achieve my goals in the {domain} domain.

The roadmap should include at least 50 tasks covering the entire year, organized into phases:

1. **Foundational Concepts (First 3 Months):** Focus on building a strong understanding of the basics of {domain}.
2. **Intermediate Skills (Next 3 Months):** Start applying foundational knowledge to real-world problems, focusing on {domain}-related skills and projects.
3. **Advanced Projects (Final 6 Months):** Work on complex {domain} projects, covering advanced topics and practical applications. Include hands-on projects and research.

Each task should be elaborate and precise, with specific instructions, resources, and due dates. Ensure that the tasks are challenging yet achievable for a beginner and that they build on each other to facilitate gradual progression.

Include regular assessments or checkpoints every month to evaluate progress and make necessary adjustments.

The deadlines must be spread across the year and should be represented in the "dd-mm-yyyy" format. For example, if a task's deadline is 10th August 2024, it should be written as "10-08-2024". Please ensure the roadmap leads to a comprehensive understanding of {domain} by the end of the year.
"""
    return prompt


def extract_domain(command):
    # Split the string based on the ": " separator
    parts = command.split(": ", 1)
    
    # If the split was successful and there's a second part, return it as the domain
    if len(parts) > 1:
        domain = parts[1].strip()  # Strip any leading/trailing whitespace
        return domain
    else:
        return None  # Return None if the format is incorrect


def roadmap_tasktype_setter(db,username):
# Fetch the task types for the user
    task_types = db.collection('Users').document(username).collection('TaskType').get()

    # Convert Firestore documents to dictionaries
    task_types = [task_type.to_dict() for task_type in task_types]

    # Initialize variables to hold the roadmap details
    roadmap = None
    roadmap_color = None

    # Iterate through the task types to find the "roadmap"
    for task_type in task_types:
        if task_type.get('taskTypeName') == 'Roadmap':
            roadmap = task_type.get('taskTypeName')
            roadmap_color = task_type.get('taskTypeColor')
            break  # Exit loop once roadmap is found

    if roadmap==None:
        roadmap_color = "#B8E0D2"
    
    return roadmap_color


def parse_due_date(due_date_str):
    return datetime.strptime(due_date_str, "%d-%m-%Y")

def FirstNote():
    return """### Welcome to Your First Note!

Hey there! 🌟 You've just unlocked the ultimate note-taking platform. Whether you're here to jot down ideas, manage your tasks, or explore new resources, you're in the right place.

Take a moment to explore and get comfy. We’ve got some cool features to help you out:

<br>

#### **Special Slash Commands** 🚀
- **`/manage my deadlines`**: Feeling overwhelmed? Use this command to stay on top of your deadlines like a pro!
- **`/youtube resources: <domain>`**: Need to dive into a topic? Fetch the best YouTube resources for any domain with just a slash.
- **`/roadmap: <domain>`**: Want to master something? Generate a year-round plan tailored to your goals.

These commands can be accessed via the chatbot available throughout the app.

<br>

#### **How to Use Markdown** 📝

Here's a quick visual guide on how you can make your notes more engaging with markdown:

<br>

1. **Creating Headers**:  
   Use different levels of headers to organize your content. For example:  
   ```markdown
   # Header 1
   ## Header 2
   ### Header 3
   ```
   This will create a hierarchy of headings.

<br>

2. **Making Text Bold or Italic**: 

   - To **bold** text, use double asterisks or underscores: 
     ```markdown
     **This text is bold**
     __This text is also bold__
     ```

   - To *italicize* text, use single asterisks or underscores:  
     ```markdown
     *This text is italic*
     _This text is also italic_
     ```

<br>

3. **Creating Lists**:  

   - **Unordered Lists**: Use asterisks, pluses, or dashes.  
     ```markdown
     * Item 1
     * Item 2
     ```

   - **Ordered Lists**: Just start with numbers.  
     ```markdown
     1. First item
     2. Second item
     ```

<br>

4. **Adding Links**:  

   You can add links like this:  
   ```markdown
   [Link Text](http://example.com)
   ```

<br>

5. **Adding an Image or GIF**:  

   ![My First Image Hooray](https://media.tenor.com/Iccl_wfwIdwAAAAM/despicable-me-minions.gif)  

   Simply use the format:  
   ```markdown
   ![Alt text](image_url)
   ```

<br>

6. **Inserting Code Blocks**:  

   For inline code, use backticks:  
   ```markdown
   `This is inline code`
   ```

   For multi-line code blocks, use triple backticks:  
   ```python
   print("Hello, World!")
   ```

<br>

7. **Adding Color to Text** 🎨  

   You can add color to your text to make it stand out. You can use plain text color names like 'red', 'green', 'blue', etc., or use hex codes or RGB values. For example:  
   ```markdown
   <span style="color: red;">This text is red</span>. But this text is plain <br>
   <span style="color: #3498db;">This text is blue (using hex code)</span>. But this text is plain <br>
   <span style="color: rgb(255,165,0);">This text is orange (using RGB)</span>. But this text is plain <br>
   ```

   **This will be seen as follows:**

   <span style="color: red;">This text is red</span>. But this text is plain <br>
   <span style="color: #3498db;">This text is blue</span>. But this text is plain <br>
   <span style="color: rgb(255,165,0);">This text is orange</span>. But this text is plain <br>

<br>

8. **Highlighting Text** 💡  

   Just like text coloring, you can highlight text with different colors. Use plain text names, hex codes, or RGB values for the highlight color. For example:  
   ```markdown
   <span style="background-color: #FF9FAE;">This text is highlighted in pink</span>. But this text is plain <br>
   <span style="background-color: #FDE995;">This text is highlighted in yellow</span>. But this text is plain <br>
   <span style="background-color: #A6E1C5;">This text is highlighted in light green</span>. But this text is plain <br>
   <span style="background-color: #A7E0F6;">This text is highlighted in light blue</span>. But this text is plain <br>
   <span style="background-color: #E1A7FB;">This text is highlighted in light purple</span>. But this text is plain <br>
   ```

   **This will be seen as follows:**

   <span style="background-color: #FF9FAE;">This text is highlighted in pink</span>. But this text is plain <br>
   <span style="background-color: #FDE995;">This text is highlighted in yellow</span>. But this text is plain <br>
   <span style="background-color: #A6E1C5;">This text is highlighted in light green</span>. But this text is plain <br>
   <span style="background-color: #A7E0F6;">This text is highlighted in light blue</span>. But this text is plain <br>
   <span style="background-color: #E1A7FB;">This text is highlighted in light purple</span>. But this text is plain <br>

<br>

   **Sample Highlight Color Palette:**

   - Pink: `#FF9FAE`
   - Yellow: `#FDE995`
   - Light Green: `#A6E1C5`
   - Light Blue: `#A7E0F6`
   - Light Purple: `#E1A7FB`

<br>

**Note:**  
The `<br>` tag is used to add line breaks. It may be thought of as an `Enter` Key's Equivalent. Another Important element in markdown is the `---` which creates a horizontal line so as to provide sections in your notes.

<br>

#### **Putting It All Together**:
Combine these elements to create notes that are both functional and visually appealing.

<br>

#### **Resources**:
For more details, visit [Markdown Guide](https://www.markdownguide.org/getting-started/).

<br>

This is just the beginning—there’s so much more to discover. Happy noting! ✨
"""

def resumeScorerPrompt(docs, jobDescription):
    return f""" You are a highly specialized resume evaluator tasked with providing *strict, job-specific feedback* based on the *exact* job description provided. Your evaluation must emphasize precise alignment with the job description, penalizing mismatches and offering *detailed recommendations* on how to improve any deficiencies. The scoring should reflect how well the resume meets the requirements, and your feedback must provide clear, actionable suggestions for improvement.

### Job Description:
{jobDescription}

### Resume Content:
{docs}

### Evaluation Criteria with Detailed Recommendations:

#### 1. *Role Alignment (Critical)*
   - *Role Fit* (out of 100): 
     Evaluate how closely the resume aligns with the responsibilities and role outlined in the job description.
     - *Penalization Guidelines*: Penalize heavily if irrelevant roles or responsibilities dominate the resume. Deduct points for any lack of relevant experience related to the job’s specific duties.
     - *Detailed Recommendations*: 
       - *If strong alignment*: Highlight the specific experiences in the resume that demonstrate a close fit to the job. 
       - *If weak alignment*: Identify the mismatched roles or responsibilities. Provide examples of experiences that are irrelevant to the job and recommend replacing or minimizing these. Suggest adding more role-specific experiences or reframing the candidate’s responsibilities to better match the job description.

#### 2. *Skills Relevancy (Critical)*
   - *Skills Match* (out of 100): 
     Assess the resume’s skills section, focusing solely on the skills required by the job description.
     - *Penalization Guidelines*: Deduct points if key skills from the job description are missing, underrepresented, or overshadowed by unrelated skills.
     - *Detailed Recommendations*: 
       - *If strong alignment*: Mention which key skills match well and how these strengthen the resume’s alignment with the job description.
       - *If weak alignment*: Clearly identify missing critical skills from the job description and suggest specific skills the candidate should include to improve relevance. If irrelevant skills dominate, recommend downplaying or removing them, and explain how this adjustment would make the resume more focused on the job at hand.

#### 3. *Keywords and Terminology Matching*
   - *Keywords Use* (out of 100): 
     Evaluate how well the resume incorporates the keywords and phrases from the job description.
     - *Penalization Guidelines*: Penalize heavily if the resume lacks important keywords from the job description or uses terms from unrelated fields.
     - *Detailed Recommendations*: 
       - *If strong alignment*: Highlight the effective use of job-specific terminology and how it contributes to the resume’s alignment with the job.
       - *If weak alignment*: Identify critical keywords that are missing and recommend specific phrases or terminology the candidate should include. If the resume uses unrelated jargon or terminology from a different field, suggest adjusting the language to better align with the job description and industry standards.

#### 4. *Impact of Achievements*
   - *Achievements Relevance* (out of 100): 
     Analyze the relevance of the achievements in the resume and how well they reflect the impact required for the role.
     - *Penalization Guidelines*: Penalize if the achievements are unrelated to the core responsibilities or impact expected for the job. Deduct points if the accomplishments focus on tasks that do not contribute to the role's goals.
     - *Detailed Recommendations*: 
       - *If strong alignment*: Highlight specific achievements that directly relate to the job description and emphasize how they demonstrate the candidate’s ability to meet the job’s objectives.
       - *If weak alignment*: Pinpoint achievements that are irrelevant or do not match the job’s responsibilities. Suggest focusing on outcomes and accomplishments that better demonstrate the candidate’s capacity to meet the job’s demands. If necessary, recommend reframing or rewording achievements to show more relevant impact.

#### 5. *Format and Readability*
   - *Resume Style and Structure* (out of 100): 
     Evaluate the resume’s format, clarity, and overall structure, focusing on how easy it is to navigate and extract relevant information.
     - *Penalization Guidelines*: Deduct points for poor formatting, lack of clarity, or if the structure buries relevant information under unrelated content.
     - *Detailed Recommendations*: 
       - *If strong alignment*: Commend the clarity and organization of the resume and how its structure makes it easy to find relevant information.
       - *If weak alignment*: Suggest specific improvements to the resume’s format and readability. Recommend reorganizing sections to highlight relevant experiences and skills, and ensure that the most important information is easily accessible. Offer advice on improving white space, headings, and bullet points for better readability.

### Final Scoring:

- *Overall Alignment (out of 100)*: 
  Provide a final score that reflects the resume’s overall alignment with the job description. The final score should emphasize mismatches in role, skills, and keywords, even if the resume is strong for other roles.
  - *Penalization Guidelines*: Deduct substantial points for resumes that contain a significant number of irrelevant experiences, skills, or achievements. Penalize further if the resume misses essential keywords or fails to clearly communicate alignment with the job.
  - *Detailed Recommendations*: Provide a comprehensive summary of the resume’s strengths and weaknesses. Highlight what the candidate did well in aligning with the job description, and offer actionable suggestions for improvement in any areas of mismatch. Be specific about where the resume needs adjustments to better align with the job description and how the candidate can tailor their resume more effectively for this role.

### Instructions for the Model:

- Your evaluation must *strictly* adhere to the job description provided. Score based solely on how well the resume aligns with the specific requirements and expectations of the job.
- Heavily penalize resumes that contain *irrelevant experiences, skills, or achievements*. Ensure the final score reflects the job-specific relevancy, not the general quality of the resume.
- Provide *clear, detailed recommendations* for each score. Offer precise suggestions on how to improve, including specific skills, keywords, and achievements the candidate should add or adjust to better match the job description. Be explicit about what the resume lacks and how those deficiencies can be addressed.

"""
#     return f"""You are an expert in resume evaluation with extensive experience in assessing resumes across various industries and job roles. Your expertise lies in understanding what hiring managers seek and providing precise, actionable feedback to enhance resume quality. I am submitting my resume for your evaluation and request that you analyze it in the context of the specific job position I am targeting.

# Job Description: {jobDescription}

# ### Instructions:

# #### 1. Resume Scoring:
#    Evaluate the resume against the following criteria and provide a comprehensive score for each. The scoring should be detailed, reflecting the resume's effectiveness in meeting the job description's requirements and tech stack. Ensure that all scores are provided, and no parameters are left out. Each criterion is scored out of 100, with an overall score out of 100. For each score, include a detailed explanation of the reasoning behind the score, and cite specific examples from the resume text where relevant.

#    - Overall Score (out of 100): Provide an aggregate score that reflects the resume's overall effectiveness for the targeted job. Offer a detailed explanation of the score, outlining key strengths and weaknesses observed, referencing specific text from the resume to support your evaluation.
#    - Brevity Score (Keywords Matching): Assess how well the resume matches the specific keywords and phrases mentioned in the job description. Highlight specific sections or lines from the resume where keywords are used effectively or missing. Suggest precise keywords from the job description that should be integrated and indicate where they could be placed.
#    - Impact Score (Achievements and Metrics): Evaluate the relevance and impact of the achievements listed. Reference specific achievements from the resume that demonstrate quantifiable results and contributions. Suggest how these could be improved or rephrased, providing examples of revised text that better align with job responsibilities and outcomes.
#    - Style Score (Format and Readability): Examine the resume's overall style, including its format, structure, and readability. Provide feedback with direct references to specific formatting issues, such as inconsistent bullet points, awkward layouts, or poor readability, and suggest exact changes to improve these elements.
#    - Skills Score (Skills and Qualifications): Evaluate the relevance, strength, and presentation of both technical and soft skills. Point out specific skills mentioned in the resume that align well with the job requirements or are missing. Suggest edits or additions with references to how these changes would better match the job description.

# #### 2. Detailed Recommendations:
#    Provide a comprehensive paragraph of recommendations with full clarity on how to improve the resume. Your feedback should be highly specific, referencing the exact text from the resume that requires adjustment:

#    - Keyword Integration: Identify precise areas in the resume where critical keywords from the job description could be better integrated. Use direct excerpts from the resume and provide suggestions on how to refine the language to better align with the job description.
#    - Achievements Enhancement: Suggest specific ways to quantify achievements more effectively, using current text from the resume as a baseline. Highlight bullet points that could benefit from more detail or clearer metrics, and provide examples of how these could be rewritten.
#    - Skills Alignment: Offer targeted advice on improving the presentation of skills by referencing specific entries from the resume. Point out any gaps between the skills listed and those required by the job, and suggest edits or removals to streamline and strengthen the skills section.
#    - Formatting Improvements: Comment on the resume's formatting and readability by citing exact examples of problematic areas. Suggest precise changes, such as reformatting sections or adjusting layout elements, to make the document more professional and easier to read.
#    - Content Relevance: Highlight specific parts of the resume that include outdated or irrelevant information. Advise on removing or revising these sections, citing the text and offering more relevant alternatives that better align with the job description.
#    - Overall Alignment: Provide an overall assessment of how well the resume aligns with the job description. Mention any critical issues that could hinder the resume's effectiveness, referencing specific resume sections and providing clear guidance on how to correct these issues.

# #### 3. Mistakes to Avoid:
#    Highlight common mistakes found in the resume by pulling specific examples from the text. Provide clear instructions on how to avoid these mistakes in the future, using direct excerpts to illustrate ineffective language, unnecessary jargon, or areas that fail to resonate with hiring managers. Offer corrected versions or alternative phrasing that would enhance the resume's appeal.

# #### 4. Final Output:
#    The final response must include all the following values. No output parameters should be omitted:

#    - A comprehensive score for each evaluation criterion, with detailed explanations and references to the resume text.
#    - Specific recommendations for each section, with actionable advice for improvements, including corrected text suggestions.
#    - A clear summary of common mistakes to avoid in future resume versions, with examples from the resume text and proposed rectifications.

#    Your response should be thorough and precise, providing clear guidance on what needs to be improved, why, and how, using direct references to the resume text to ensure full clarity and actionable advice."""