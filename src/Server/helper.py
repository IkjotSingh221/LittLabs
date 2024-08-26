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