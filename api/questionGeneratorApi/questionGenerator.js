import express from 'express';
import multer from 'multer';
import { GoogleGenAI} from '@google/genai';

  const geminiApiKey=process.env.GEMINI_API_KEY;
  const aiModelName='gemini-2.5-flash';

  const geminiAI=new GoogleGenAI({apiKey:geminiApiKey});

  const storage=multer.memoryStorage();
  const uploads=multer({
    storage:storage,
    limits:{fileSize:20*1024*1024}
  });

const mcqQuestions = [
  {
    question: "Which application-layer protocol lies at the core of the World Wide Web (WWW)?",
    options: [
      "FTP (File Transfer Protocol)",
      "MIME (Multipurpose Internet Mail Extension)",
      "HTTP (Hyper Text Transfer Protocol)",
      "URL (Uniform Resource Locator)"
    ],
    correctAnswer: "HTTP (Hyper Text Transfer Protocol)"
  },
  {
    question: "What is the primary function of a Web Browser?",
    options: [
      "To host a website on a server.",
      "To send emails between users.",
      "To access and navigate the World Wide Web.",
      "To define the structure of interlinked documents."
    ],
    correctAnswer: "To access and navigate the World Wide Web."
  },
  {
    question: "What are the three main processes that security aims to ensure regarding computer data and resources?",
    options: [
      "Speed, Efficiency, and Reliability.",
      "Integrity, Availability, and Confidentiality.",
      "Encryption, Decryption, and Authorization.",
      "Validation, Verification, and Accessibility."
    ],
    correctAnswer: "Integrity, Availability, and Confidentiality."
  },
  {
    question: "In the Client/Server Model framework, what is the server primarily responsible for?",
    options: [
      "Performing all user input validation.",
      "Providing services to other computers (clients) in a network.",
      "Defining the network's topology.",
      "Executing the user's local operating system."
    ],
    correctAnswer: "Providing services to other computers (clients) in a network."
  },
  {
    question: "According to the unit overview, what are the two main types of web browsers mentioned?",
    options: [
      "Desktop and Mobile.",
      "Graphical and Text.",
      "HTTP and HTTPS.",
      "Secure and Insecure."
    ],
    correctAnswer: "Graphical and Text."
  }
];




const router=express.Router();
    

router.post('/',uploads.single('file-input'),async(req,res)=>{
        try{
            if(!req.file){
              res.status(400).json({error:'No document uploaded!'});
            }

            const fileBuffer=req.file.buffer;
            const fileBase64=fileBuffer.toString('base64');
            const fileMimeType=req.file.mimetype;
            const {testDuration,numberOfQuestions}=req.body;
            const userPrompt=`
            Objective: Generate a list of multiple-choice questions (MCQs) based on the provided text. The output must be a single, valid, unformatted, and complete JavaScript array of objects, ready for direct parsing and use in a web application.
Output Format Constraint (Critical): The response must not contain any prose, explanations, or external text, only the final JavaScript array.
JavaScript
[
  {
    question: "...",
    options: [
      "...",
      "...",
      "...",
      "..."
    ],
    correctAnswer: "..."
  },
  {
    // ... next object
  }
]

Content Guidelines:
Number of Questions: Generate ${numberOfQuestions} high-quality, non-trivial MCQs from the text. 
Question: The question field must be a string containing the full question.
Options: The options field must be an array of strings containing exactly four distinct, plausible answer choices.
Correct Answer: The correctAnswer field must be a string that exactly matches one of the strings in the options array.
Example of the Desired Output (Do not include this example in the final output):
JavaScript
[
  {
    question: "What is the capital of France?",
    options: [
      "Berlin",
      "Madrid",
      "Paris",
      "Rome"
    ],
    correctAnswer: "Paris"
  }
]

Final Instruction: Generate the ${numberOfQuestions} MCQs now, adhering strictly to the required JavaScript array format and containing only the code.

            `

            const response=await geminiAI.models.generateContent({
              model:aiModelName,
              contents:[
                userPrompt,
                {
                  inlineData:{
                    mimeType:fileMimeType,
                    data:fileBase64
                  }
                }
              ]
            })

            console.log("response is:",response);
            return res.status(200).json({success:true,questions:response.text});
        }catch(error){
            return res.send(500).json({error:error});
        }
        
})

export default router;