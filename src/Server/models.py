from pydantic import BaseModel
from typing import Optional, List
import typing_extensions as typing

# User Signup and Login Schemas
class SignUpSchema(BaseModel):
    username: str
    email: str
    password: str

class LoginSchema(BaseModel):
    email: str
    password: str

# Task Type Schemas
class TaskTypeSchema(BaseModel):
    username: str
    taskTypeName: str
    taskTypeColor: str

class DeleteTaskTypeSchema(BaseModel):
    username: str
    taskTypeKey: str

# Todo Schemas
class TodoSchema(BaseModel):
    username: str
    taskName: str
    taskDescription: str
    dueDate: str
    taskType: str
    taskColor: str

class DeleteTodoSchema(BaseModel):
    username: str
    taskKey: str

class CompleteTodoSchema(BaseModel):
    username: str
    taskKey: str
    isCompleted: bool

# Note Schemas
class NoteSchema(BaseModel):
    username: str
    noteTitle: str
    noteText: str

class DeleteNoteSchema(BaseModel):
    username: str
    noteKey: str

class UpdateNoteSchema(BaseModel):
    username: str
    noteKey: str
    noteTitle: str
    noteText: str

# Post Schemas
class PostSchema(BaseModel):
    postDescription: str
    postCreatedBy: str
    postCreatedOn: str

class LikeSchema(BaseModel):
    postKey: str
    username: str

# Comment Schemas
class CommentSchema(BaseModel):
    commentDescription: str
    commentCreatedBy: str
    commentPostKey: str

class VoteSchema(BaseModel):
    commentKey: str
    username: str

# Chat Schema
class ChatSchema(BaseModel):
    question: str
    username: str

# Resume Scoring Schema
class ResumeScore(typing.TypedDict):
    roleAlignmentScore: int
    keywordTerminologyMatching: int
    impactOfAchievements: int
    formatAndReadability: int
    skillsRelevancyScore: int
    overallAlignmentScore: int
    recommendations: str

# Summarizer and Flashcard Schemas
class SummarizerSchema(BaseModel):
    username: Optional[str]
    noteTitle: Optional[str]
    file: Optional[str]

# Image Solver Schema
class TextualQuestionSchema(BaseModel):
    question: Optional[str] = "Solve the questions in the image."

# Interview Analysis Schema
class VideoAnalysis(typing.TypedDict):
    vocabulary: int
    confidence_level: int
    engaging_ability: int
    speaking_style: int
    overall_average: int
    review: str

# Reset Password Schema
class ResetPasswordRequest(BaseModel):
    email: str

class EmailSchema(BaseModel):
    email: str
    subject: str
    message: str

class LittNoteSchema(BaseModel):
    username: str
    noteTitle: str
    noteText: str

class AINoteSchema(BaseModel):
    title: str
    content: str