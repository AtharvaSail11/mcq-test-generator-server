# MCQ Test Generator Server

Hi, This is the Backend Server of MCQ Test Generator!
The main functionality of this server is to recieve the uploaded file from frontend, send it to gemini API along with the system prompt, 
And then sending the response JSON Data recieved from Gemini API to Frontend.

## Some challenges

-Here, I am using Gemini API free tier. So there are limited tokens per day which we can use.
-Even with implementation of techniques to reduce Hallucination of AI, Still sometimes it Hallucinates (Although it is very rare currently)

