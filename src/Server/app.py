import uvicorn
import pyrebase
import shutil
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema import StrOutputParser
from langchain.schema.prompt_template import format_document
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from fastapi import FastAPI, File, UploadFile,Form
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from google.ai.generativelanguage_v1beta.types import content
from models import *
from helper import *
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from datetime import date
import google.generativeai as genai
import time
import firebase_admin
from firebase_admin import credentials, firestore,auth
import json
load_dotenv()

api_key = os.getenv('GEMINI_API')
genai.configure(api_key=api_key)

os.environ['GOOGLE_API_KEY'] = os.getenv('GEMINI_API')
app = FastAPI(docs_url="/")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello World"}


if not firebase_admin._apps:
    cred = credentials.Certificate(r"C:\Users\ikjot\Documents\Coding\LittLabs\LittLabs\src\Server\serviceAccountKey.json")
    firebase_admin.initialize_app(cred)


firebaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID")
}

firebase = pyrebase.initialize_app(firebaseConfig)
db = firestore.client()

@app.post('/signup')
async def create_an_account(user_data: SignUpSchema):
    email = user_data.email
    password = user_data.password
    username = user_data.username

    users_ref = db.collection('Users')
    existing_users = users_ref.where('username', '==', username).get()

    if existing_users:
        raise HTTPException(status_code=400, detail="Display name already exists.")
    

    try:
        user = auth.create_user(
            display_name=username,
            email=email,
            password=password
        )
        u=db.collection('Users').document(username).set({"username":username})
        # Create a document in the 'Users' collection with the username as the document ID
        user_doc_ref = db.collection('Users').document(username)
        # print(user_doc_ref.id)
        
        today = datetime.today().strftime('%d-%m-%Y')
        # Create empty collections for the user
        sample_note=user_doc_ref.collection('Notes').document()
        sample_note.set({
        "noteTitle":"Welcome to Litt Labs",
        "noteText":FirstNote(),
        "creationDate":today,
        "noteKey": sample_note.id
    })
        sample_todo=user_doc_ref.collection('Todos').document()
        sample_todo.set({
        "taskName": "First Task",
        "taskDescription": "Explore this Website",
        "taskType": "Explore",
        "dueDate": today,
        "taskColor": "#A4E1FF",
        "isCompleted": False,
        "taskKey": sample_todo.id
    })
        sample_taskType=user_doc_ref.collection('TaskType').document()
        sample_taskType.set({
        "taskTypeName":"Explore",
        "taskTypeColor":"#A4E1FF",
        "taskTypeKey": sample_taskType.id
    })  
        

        return JSONResponse(content={"username": username},
                            status_code=201)
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail=f"Account already created for the email {email}"
        )


@app.post('/login')
async def create_access_token(user_data:LoginSchema):
    email = user_data.email
    password = user_data.password

    try:
        user = firebase.auth().sign_in_with_email_and_password(
            email = email,
            password = password
        )

        token = user['idToken']
        user_info = firebase.auth().get_account_info(token)
        display_name = user_info['users'][0].get('displayName', '')


        return JSONResponse(
            content={
                # "token":token
                "username":display_name
            },status_code=200
        )

    except:
        raise HTTPException(
            status_code=400,detail="Invalid Credentials"
        )



@app.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    try:
        # Send password reset email
        user = auth.get_user_by_email(req.email)
        firebase.auth().send_password_reset_email(req.email)
        return {"message": "Password reset email sent successfully."}
    except firebase_admin.auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User with this email does not exist.")
    except firebase_admin.auth.AuthError as e:
        raise HTTPException(status_code=400, detail=f"Error sending password reset email: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")



@app.put("/notes/update")
async def update_note(note: UpdateNoteSchema):
    note_ref = db.collection('Users').document(note.username).collection('Notes').document(note.noteKey)
    print(note_ref)
    # Check if the document exists
    if not note_ref.get().exists:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Update the note
    note_ref.update({
        "noteTitle": note.noteTitle,
        "noteText": note.noteText
    })
    
    return {"message": "Note updated successfully"}


@app.post("/notes/create")
async def create_note(note:NoteSchema):
    user_doc_ref = db.collection('Users').document(note.username)    
    new_note = user_doc_ref.collection('Notes').document()
    new_note.set({
        "noteTitle":note.noteTitle,
        "noteText":note.noteText,
        "creationDate":note.creationDate,
        "noteKey": new_note.id
    })    
    return {"noteKey": new_note.id}

@app.get("/notes/read")
async def read_notes(username:str):
    notes = db.collection('Users').document(username).collection('Notes').get()
    notes=[notes[i].to_dict() for i in range(len(notes))]
    return notes


@app.delete("/notes/delete")
async def delete_notes(note:DeleteNoteSchema):
    db.collection('Users').document(note.username).collection('Notes').document(note.noteKey).delete()
    return {"message":"Note deleted successfully"}

@app.post("/todo/create")
async def create_todo(todo: TodoSchema):
    # Step 1: Create a new document with generated ID
    new_todo_ref = db.collection('Users').document(todo.username).collection('Todos').document()
    new_todo_ref.set({
        "taskName": todo.taskName,
        "taskDescription": todo.taskDescription,
        "taskType": todo.taskType,
        "dueDate": todo.dueDate,
        "taskColor": todo.taskColor,
        "isCompleted": todo.isCompleted,
        "taskKey": new_todo_ref.id  # Store the generated ID in the document
    })
    
    return {"message": f"{new_todo_ref.id} created successfully"}




@app.get("/todo/read")
async def read_todos(username: str):
    tasks = db.collection('Users').document(username).collection('Todos').get()
    todos = [task.to_dict() for task in tasks]
    return todos

@app.delete("/todo/delete")
async def delete_todo(user_data:DeleteTodoSchema):
    db.collection('Users').document(user_data.username).collection('Todos').document(user_data.taskKey).delete()
    return {"message":"Note deleted successfully"}

@app.put("/todo/complete")
async def update_todo_completed(complete_todo: CompleteTodoSchema):
    db.collection('Users').document(complete_todo.username).collection('Todos').document(complete_todo.taskKey).update({"isCompleted":complete_todo.isCompleted})
    if complete_todo.isCompleted:
        task = db.collection('Users').document(complete_todo.username).collection('Todos').document(complete_todo.taskKey).get().to_dict()
        if task['taskType'] == 'Roadmap':
            rmap_tasks = db.collection('Users').document(complete_todo.username).collection('Roadmap').get()
            rmap_tasks = [task.to_dict() for task in rmap_tasks]
            incomplete_rmap_tasks = [task for task in rmap_tasks if not task.get('isCompleted', True)]
            incomplete_rmap_tasks.sort(key=lambda x: parse_due_date(x['dueDate']))
            if incomplete_rmap_tasks:
                new_todo_ref = db.collection('Users').document(complete_todo.username).collection('Todos').document(incomplete_rmap_tasks[0]['taskKey']).set(incomplete_rmap_tasks[0])
                db.collection('Users').document(complete_todo.username).collection('Roadmap').document(incomplete_rmap_tasks[0]['taskKey']).delete()
    return {"message":"Task completed successfully"}

@app.get("/taskType/read")
async def read_task_types(username:str):
    task_types = db.collection('Users').document(username).collection('TaskType').get()
    task_types = [task_types[i].to_dict() for i in range(len(task_types))]
    return task_types

@app.post("/taskType/create")
async def create_task_type(taskType: TaskTypeSchema):    
    new_taskType = db.collection('Users').document(taskType.username).collection('TaskType').document()
    new_taskType.set({
        "taskTypeName":taskType.taskTypeName,
        "taskTypeColor":taskType.taskTypeColor,
        "taskTypeKey": new_taskType.id
    })    
    x = db.collection('Users').document(taskType.username).collection('TaskType').get()
    del x
    return {"taskTypeKey": new_taskType.id}

@app.delete("/taskType/delete")
async def delete_task_type(deleteTaskType: DeleteTaskTypeScheme):
    doc_ref = db.collection('Users').document(deleteTaskType.username).collection('TaskType').document(deleteTaskType.taskTypeKey)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.delete()
        return {"message": "Task Type deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task Type not found")

@app.post('/chat')
async def chat(userPrompt: ChatSchema):
    tasks = db.collection('Users').document(userPrompt.username).collection('Todos').get()
    task_dict = {}
    print(userPrompt.username, userPrompt.question)

    # Convert Firestore documents to dictionary format
    for task in tasks:
        task_data = task.to_dict()
        if task_data['isCompleted'] == False:
            due = datetime.strptime(task_data['dueDate'], "%d-%m-%Y")
            task_dict[task_data['taskName']] = [task_data['taskDescription'], due, task_data['taskType'], task_data['taskColor']]

    # Retrieve chat history from Firestore
    chat_history_ref = db.collection('Users').document(userPrompt.username).collection('ChatHistory').document('history')
    chat_history_doc = chat_history_ref.get()

    if chat_history_doc.exists:
        chat_history = chat_history_doc.to_dict().get('history', [])
    else:
        chat_history = []

    # Create the chat model and pass the retrieved history
    model = genai.GenerativeModel("gemini-1.5-flash")
    chat = model.start_chat(history=chat_history)

    if "/manage my deadlines" in userPrompt.question.lower():
        today = date.today()
        prompt = generate_deadline_management_prompt(today, task_dict)
        response = chat.send_message(prompt)

    elif "/youtube resources" in userPrompt.question.lower():
        domain = extract_domain(userPrompt.question)
        prompt = (
            f"Generate a list of resources to help someone learn more about {domain}. "
            "Each resource should include the YouTube channel name, a brief description of the video, "
            "and the YouTube link."
        )
        response = chat.send_message(prompt)

    elif "/roadmap" in userPrompt.question.lower():
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192 * 2,
            "response_schema": content.Schema(
                type=content.Type.ARRAY,
                items=content.Schema(
                    type=content.Type.OBJECT,
                    enum=[],
                    required=["TaskHeading", "TaskDescription", "DueDate"],
                    properties={
                        "TaskHeading": content.Schema(type=content.Type.STRING),
                        "TaskDescription": content.Schema(type=content.Type.STRING),
                        "DueDate": content.Schema(type=content.Type.STRING),
                    },
                ),
            ),
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config,
        )

        chat_session = model.start_chat(history=chat_history)
        print("Chat session started")
        domain = extract_domain(userPrompt.question)
        today = date.today().strftime("%d-%m-%Y")
        prompt = roadmap_prompt(domain, today)
        response = chat_session.send_message(prompt)
        print("Chat session response received", response.text)
        
        for i in json.loads(response.text):
            new_roadmap_ref = db.collection('Users').document(userPrompt.username).collection("Roadmap").document()
            new_roadmap_ref.set({
                "taskName": i['TaskHeading'],
                "taskDescription": i['TaskDescription'],
                "taskType": "Roadmap",
                "dueDate": i['DueDate'],
                "taskColor": roadmap_tasktype_setter(db,userPrompt.username),
                "isCompleted": False,
                "taskKey": new_roadmap_ref.id
            })
        
        new_taskType = db.collection('Users').document(userPrompt.username).collection('TaskType').document()
        new_taskType.set({
        "taskTypeName":"Roadmap",
        "taskTypeColor":roadmap_tasktype_setter(db,userPrompt.username),
        "taskTypeKey": new_taskType.id
    })  
        rmap_tasks = db.collection('Users').document(userPrompt.username).collection('Roadmap').get()
        rmap_tasks = [task.to_dict() for task in rmap_tasks]
        incomplete_rmap_tasks = [task for task in rmap_tasks if not task.get('isCompleted', True)]
        incomplete_rmap_tasks.sort(key=lambda x: parse_due_date(x['dueDate']))
        new_todo_ref = db.collection('Users').document(userPrompt.username).collection('Todos').document(incomplete_rmap_tasks[0]['taskKey']).set(incomplete_rmap_tasks[0])
        db.collection('Users').document(userPrompt.username).collection('Roadmap').document(incomplete_rmap_tasks[0]['taskKey']).delete()
        

        return {"response": "Roadmap created successfully! Please check your Todo Page for the updates. New tasks will be revealed as soon as you complete the previous ones.", "task": incomplete_rmap_tasks[0]}

    else:
        response = chat.send_message(userPrompt.question)

    # Append the current user question and model response to the chat history
    chat_history.append({"role": "user", "parts": userPrompt.question})
    chat_history.append({"role": "model", "parts": response.text})

    # Store updated chat history back in Firestore
    chat_history_ref.set({"history": chat_history})

    return {"response": response.text}



@app.post("/upload-video")
async def process_video(file: UploadFile = File(...)):
    model = genai.GenerativeModel('gemini-1.5-pro',
                              generation_config={"response_mime_type": "application/json",
                                                 "response_schema": VideoAnalysis})

    prompt= vidPrompt()

    with tempfile.TemporaryDirectory() as tmpdirname:
        # Save the uploaded video file
        file_location = os.path.join(tmpdirname, file.filename)
        with open(file_location, "wb") as f:
            shutil.copyfileobj(file.file, f)
        print("File saved ")
        # Upload the video file to Google Generative AI
        video_file = genai.upload_file(path=file_location)

        while video_file.state.name == "PROCESSING":
            print('.', end='')
            time.sleep(10)
            video_file = genai.get_file(video_file.name)
    
        if video_file.state.name == "FAILED":
            raise ValueError(video_file.state.name)

        # Generate content using the uploaded video and the prompt
        print("Generating content...")
        response = model.generate_content([video_file, prompt])
        print(response.text)
    return json.loads(response.text)


@app.post("/flashcards")
async def generate_flashcards(noteKey: str = Form(None), username: str = Form(None), file: UploadFile = File(None)):
    print(f"Received file: {file.filename if file else 'No file'}")
    print(f"Received noteKey: {noteKey}")
    print(f"Received username: {username}")

    FlashCardSchema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "question": {"type": "string"},
                "answer": {"type": "string"},
                "hint": {"type": "string"}
            },
            "required": ["question", "answer", "hint"]
        }
    }

    content = ""

    if noteKey and username:
        # Fetch the note from Firestore
        note_ref = db.collection('Users').document(username).collection('Notes').document(noteKey)
        note = note_ref.get()
        if not note.exists:
            raise HTTPException(status_code=404, detail="Note not found.")
        content = note.to_dict().get('noteText', '')
        print("Fetched note content.")

    elif file and file.filename != "":
        # Process the uploaded PDF file
        with tempfile.TemporaryDirectory() as tmpdirname:
            file_location = os.path.join(tmpdirname, file.filename)
            with open(file_location, "wb") as f:
                shutil.copyfileobj(file.file, f)
            
            loader = PyPDFLoader(file_location)
            docs = loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=2000)
            splits = text_splitter.split_documents(docs)
            
            content = '\n\n\n\n'.join([split.page_content for split in splits])
            print("Processed PDF content.")

    else:
        raise HTTPException(status_code=400, detail="No PDF uploaded and no noteKey/username provided.")

    # Proceed with the prompt creation and model interaction
    prompt_template = PromptTemplate(
        input_variables=['notes'],
        template='''Act as a teacher and consider the following text:
        {notes}
        Generate a list of question-answer pairs of varying difficulties.
        The questions should be of type fill-in-the-blank or True/False.
        The output should be a JSON array where each element contains "question", "answer", and "hint".
        '''
    )

    model = genai.GenerativeModel(
        'gemini-1.5-flash',
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": FlashCardSchema
        }
    )

    prompt = prompt_template.format(notes=content)
    
    response = model.generate_content(prompt)

    return json.loads(response.text)



@app.post("/post/create")
async def create_post(post: PostSchema):
    new_post_ref = db.collection('Posts').document()
    new_post_ref.set({
        "postDescription": post.postDescription,
        "postCreatedBy": post.postCreatedBy,
        "postCreatedOn": post.postCreatedOn,
        "postLikesCount": post.postLikesCount,
        "likedByUsers":post.likedByUsers,
        "postKey": new_post_ref.id
    })
    
    return {"message": new_post_ref.id}

@app.get("/post/read")
async def read_posts():
    posts = db.collection('Posts').get()
    posts_dict = [post.to_dict() for post in posts]
    return posts_dict

@app.post("/comment/create")
async def create_comment(comment: CommentSchema):
    new_comment_ref = db.collection('Comments').document()
    new_comment_ref.set({
        "commentDescription": comment.commentDescription,
        "commentCreatedBy": comment.commentCreatedBy,
        "commentPostKey": comment.commentPostKey,
        "commentUpvotes": comment.commentUpvotes,
        "commentDownvotes": comment.commentDownvotes,
        "upvotedByUsers": comment.upvotedByUsers,
        "downvotedByUsers": comment.downvotedByUsers,
        "commentKey": new_comment_ref.id
    })
    
    return {"message": new_comment_ref.id}

@app.get("/comment/read")
async def read_comments():
    comments = db.collection('Comments').get()
    comments_dict = [comment.to_dict() for comment in comments]
    return comments_dict

@app.post("/post/like-unlike")
async def like_post(like: LikeSchema):
    post_ref = db.collection('Posts').document(like.postKey)
    post = post_ref.get().to_dict()
    print(post)
    if like.username not in post["likedByUsers"]:
        # Like the post
        post['likedByUsers'].append(like.username)
        post_ref.update({
            "postLikesCount": post['postLikesCount'] + 1,
            "likedByUsers": post['likedByUsers']
        })
        return {"message": "Post liked"}
    else:
        # Unlike the post
        post['likedByUsers'].remove(like.username)
        post_ref.update({
            "postLikesCount": post['postLikesCount'] - 1,
            "likedByUsers": post['likedByUsers']
        })
        return {"message": "Post unliked"}
    
@app.post("/comment/upvote")
async def upvote_comment(vote: VoteSchema):
    comment_ref = db.collection('Comments').document(vote.commentKey)
    comment = comment_ref.get().to_dict()

    if vote.username not in comment['upvotedByUsers']:
        # Upvote the comment
        comment['upvotedByUsers'].append(vote.username)
        comment_ref.update({
            "commentUpvotes": comment['commentUpvotes'] + 1,
            "upvotedByUsers": comment['upvotedByUsers']
        })

        # If the user had downvoted before, remove their downvote
        if vote.username in comment['downvotedByUsers']:
            comment['downvotedByUsers'].remove(vote.username)
            comment_ref.update({
                "commentDownvotes": comment['commentDownvotes'] - 1,
                "downvotedByUsers": comment['downvotedByUsers']
            })

        return {"message": "Comment upvoted"}
    else:
        comment['upvotedByUsers'].remove(vote.username)
        comment_ref.update({
            "commentUpvotes": comment['commentUpvotes'] - 1,
            "upvotedByUsers": comment['upvotedByUsers']
        })
        return {"message": "User had already upvoted this comment"}
    
@app.post("/comment/downvote")
async def downvote_comment(vote: VoteSchema):
    comment_ref = db.collection('Comments').document(vote.commentKey)
    comment = comment_ref.get().to_dict()

    if vote.username not in comment['downvotedByUsers']:
        # Downvote the comment
        comment['downvotedByUsers'].append(vote.username)
        comment_ref.update({
            "commentDownvotes": comment['commentDownvotes'] + 1,
            "downvotedByUsers": comment['downvotedByUsers']
        })

        # If the user had upvoted before, remove their upvote
        if vote.username in comment['upvotedByUsers']:
            comment['upvotedByUsers'].remove(vote.username)
            comment_ref.update({
                "commentUpvotes": comment['commentUpvotes'] - 1,
                "upvotedByUsers": comment['upvotedByUsers']
            })

        return {"message": "Comment downvoted"}
    else:
        comment['downvotedByUsers'].remove(vote.username)
        comment_ref.update({
            "commentDownvotes": comment['commentDownvotes'] - 1,
            "downvotedByUsers": comment['downvotedByUsers']
        })
        return {"message": "User already downvoted this comment"}


@app.post("/scorer")
async def generate_resumeReview(file: UploadFile = File(None), jobDescription: str = ""):
    print(f"Received file: {file.filename if file else 'No file'}")

    # ResumeScorerSchema = {
    #     "type": "array",
    #     "items": {
    #         "type": "object",
    #         "properties": {
    #             "overallScore": {"type": "int"},
    #             "impactScore": {"type": "int"},
    #             "brevityScore": {"type": "int"},
    #             "styleScore":{"type":"int"},
    #             "skillsScore":{"type":"int"},
    #             "recommendations":{"type":"string"},
    #             "highlightedResume":{"type":"string"}
    #         },
    #         "required": ["overallScore", "impactScore", "brevityScore","styleScore","skillsScore","recommendations"]
    #     }
    # }

    content = ""

    if file and file.filename != "":
        # Process the uploaded PDF file
        with tempfile.TemporaryDirectory() as tmpdirname:
            file_location = os.path.join(tmpdirname, file.filename)
            with open(file_location, "wb") as f:
                shutil.copyfileobj(file.file, f)
            
            loader = PyPDFLoader(file_location)
            docs = loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=2000)
            splits = text_splitter.split_documents(docs)
            
            content = '\n\n\n\n'.join([split.page_content for split in splits])
            print("Processed PDF content.")

    else:
        raise HTTPException(status_code=400, detail="No PDF uploaded.")

    # Proceed with the prompt creation and model interaction
    prompt_template = resumeScorerPrompt(docs,jobDescription)

    model = genai.GenerativeModel(
        'gemini-1.5-flash',
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": ResumeScore
        }
    )

    
    
    response = model.generate_content(prompt_template)
    print(response.text)
    

    return json.loads(response.text)







@app.post("/imagesolver/")
async def generate_response(userPrompt:str = Form(default=""),file: UploadFile = File(None)):
    # Create a temporary directory
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    if file:
        with tempfile.TemporaryDirectory() as tmpdirname:
            # Save the uploaded file
            file_location = os.path.join(tmpdirname, file.filename)
            with open(file_location, "wb") as f:
                shutil.copyfileobj(file.file, f)
            
            # Upload the image file to Google Generative AI
            sample_file = genai.upload_file(path=file_location, display_name=file.filename)
            if userPrompt=="":
                prompt = "Solve the questions in the image."
            # Generate content using the uploaded image and a prompt
            else:
                prompt = userPrompt
            print(prompt)
            response = model.generate_content([sample_file, prompt])
    else:
        chat = model.start_chat(history=[])
        response = chat.send_message(userPrompt)

        # Return the generated response as JSON
    return JSONResponse(content={"response": response.text})

@app.post("/summarizer")
async def generate_summary(noteKey: str = Form(None), username: str = Form(None), file: UploadFile = File(None)):
    # Ensure at least one source of text is provided
    if not file and not (noteKey and username):
        raise HTTPException(status_code=400, detail="No PDF uploaded and no noteKey/username provided.")
    
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7, top_p=0.85)
    llm_prompt = summ_prompts()
    if file:
        
        # Process the uploaded PDF file
        with tempfile.TemporaryDirectory() as tmpdirname:
            file_location = os.path.join(tmpdirname, file.filename)
            with open(file_location, "wb") as f:
                shutil.copyfileobj(file.file, f)
            
            # Load the PDF
            loader = PyPDFLoader(file_location)
            docs = loader.load()
            doc_prompt = PromptTemplate.from_template("{page_content}")
            stuff_chain = (
        
            {
                "text": lambda docs: "\n\n".join(format_document(doc, doc_prompt) for doc in docs)
            }
            | llm_prompt         # Prompt for Gemini
            | llm                # Gemini function
            | StrOutputParser()  # output parser
            )
        
        response = stuff_chain.invoke(docs)
        # Return the generated flashcards as JSON
        
    
    elif noteKey and username:
        # Fetch specific note using noteKey from Firestore
        note_ref = db.collection('Users').document(username).collection('Notes').document(noteKey)
        note = note_ref.get()
        if not note.exists:
            raise HTTPException(status_code=404, detail="Note not found.")
        else:
            print("Note found")
            note_txt=note.to_dict().get('noteText', '')
            print(note_txt)
            stuff_chain = ( {"text": lambda note_txt: note.to_dict().get('noteText', '')}
            | llm_prompt         # Prompt for Gemini
            | llm                # Gemini function
            | StrOutputParser()  # output parser
            )
            response = stuff_chain.invoke(note)
    return {"Summary": response}

# @app.post("/roadmapRecommendation")
# async def generate_roadmap_recommendation(domain: str):
#     RoadmapRecommendationSchema = {
#         "type": "array",
#         "items": {
#             "type": "object",
#             "properties": {
#                 "channelName": {"type": "string"},
#                 "videoDescription": {"type": "string"},
#                 "youtubeLink": {"type": "string"}
#             },
#             "required": ["channelName", "videoDescription", "youtubeLink"]
#         }
#     }
    
#     model = genai.GenerativeModel(
#         'gemini-1.5-flash',
#         generation_config={
#             "response_mime_type": "application/json",
#             "response_schema": RoadmapRecommendationSchema
#         }
#     )
    
#     prompt = (
#         f"Generate a list of resources to help someone learn more about {domain}. "
#         "Each resource should include the YouTube channel name, a brief description of the video, "
#         "and the YouTube link. "
#     )
    
#     response = model.generate_content(prompt)
#     return json.loads(response.text)


if __name__ == "__main__":
    uvicorn.run("app:app",reload=True,port=8000)


# post likes and comments table