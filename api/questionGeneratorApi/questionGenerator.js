import express from 'express';
import multer from 'multer';
import { config } from 'dotenv';
import { GoogleGenAI } from '@google/genai';

config();

const geminiApiKey = process.env.GEMINI_API_KEY.trim();
// console.log("geminiApiKey:", geminiApiKey);
const aiModelName = 'gemini-2.5-flash';

const geminiAI = new GoogleGenAI({ apiKey: geminiApiKey });

const storage = multer.memoryStorage();
const uploads = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }
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


const questionSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    options: {
      type: 'array',
      items: { type: 'string' }
    },
    correctAnswer: { type: 'string' }
  }
}

const arraySchema = {
  type: 'array',
  items: questionSchema
}



const router = express.Router();


router.post('/', uploads.single('docFile'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No document uploaded!' });
    }

    // console.log('req.file:',req.file);
    const fileBuffer = req.file.buffer;
    const fileBase64 = fileBuffer.toString('base64');
    const fileMimeType = req.file.mimetype;
    const { testDuration, numberOfQuestions } = req.body;

    // console.log("numberOfQuestions:", numberOfQuestions)
    // console.log("fileBuffer:", fileBuffer);
    const userPrompt = `
Generate ${numberOfQuestions} high-quality, non-trivial MCQs based on the attached file.

Output Requirements:
1. Return ONLY a valid JSON array of objects.
2. No prose, markdown code blocks, or explanations.
3. Use this JSON schema:
   {
     "question": "string",
     "options": ["string", "string", "string", "string"],
     "correctAnswer": "string"
   }
4. The 'correctAnswer' must exactly match one of the four options.
            `

    const response = await geminiAI.models.generateContent({
      model: aiModelName,
      contents: [
        userPrompt,
        {
          inlineData: {
            mimeType: fileMimeType,
            data: fileBase64
          }
        }
      ],
    },{
      retryConfig:{
        maxRetries:0
      }
    })

    const jsonRegex=/\[[\s\S]*\]/;
    const match=response.text.match(jsonRegex)

    if(match){
          const cleanedOutput=JSON.parse(match[0]);
          return res.status(200).json({ success: true, questions: cleanedOutput });
    }else{
      return res.status(400).json({error:'No json data found!'});
    }

  } catch (error) {
    if (error.status === 503) {
      console.log('gemini api is overloaded',error.message)
      return res.status(503).json({ error })
    } else {
      console.log("error is:", error);
      return res.status(400).json({ error: error });
    }

  }

})

export default router;