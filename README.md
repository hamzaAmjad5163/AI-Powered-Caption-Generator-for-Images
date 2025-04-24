# AI-Powered-Caption-Generator-for-Images

![image](https://github.com/user-attachments/assets/601a848c-8a7f-4a50-b7ce-e32bb3354843)

This project is an interactive, web-based tool that allows users to upload any image and receive a creative or context-aware caption generated using AI. It's designed to blend machine learning capabilities with modern frontend web development to deliver a unique and fun user experience.

Whether you're a content creator, marketer, designer, or meme lover, this tool helps you auto-generate smart, catchy, or funny captions to match the vibe of your image — instantly.

![image](https://github.com/user-attachments/assets/fe56f7f3-f750-4aa6-900b-44262364635a)


CLIENT FOLDER:
```
ai-caption-generator/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                  # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── package.json
└── database/               # MySQL scripts

Run these command in terminal for `client` and `server`
```
### Client
```
npx create-react-app client
cd client
npm install axios react-dropzone react-image-filter styled-components
```

### Server

```
mkdir server && cd server
npm init -y
npm install express mysql2 multer cors dotenv openai
```
