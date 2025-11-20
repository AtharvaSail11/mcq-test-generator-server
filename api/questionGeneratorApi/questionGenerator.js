import express from 'express';

  const geminiApiKey=process.env.GEMINI_API_KEY;
  const aiModelName='gemini-2.5-flash';

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
    

router.post('/',(req,res)=>{
        try{
            const data=req.body;
            console.log("data:",data);
            return res.status(200).json({questions:mcqQuestions});
        }catch(error){
            return res.send(500).json({error:error});
        }
        
})

export default router;