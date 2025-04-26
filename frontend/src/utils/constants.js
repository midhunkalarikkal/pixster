export const THEMES = [
    "black",
    "nord",
    "lofi",
  ];

  export const pairedMessages = [
    {
        sender: {
            text: "Hey, the Pixster social app is live on Render! Check it out.",
            timestamp: new Date("2023-10-27T10:00:00Z"),
        },
        receiver: {
            text: "Awesome! I'm checking it now.",
            timestamp: new Date("2023-10-27T10:02:00Z"),
        },
    },
    {
        sender: {
            text: "How's the real-time messaging working with Socket.IO?",
            timestamp: new Date("2023-10-27T10:05:00Z"),
        },
        receiver: {
            text: "Socket.IO is working perfectly! Messages are instant.",
            timestamp: new Date("2023-10-27T10:10:00Z"),
        },
    },
    {
        sender: {
            text: "The DaisyUI styling looks great on mobile!",
            timestamp: new Date("2023-10-27T10:15:00Z"),
        },
        receiver: {
            text: "Agreed! DaisyUI's responsiveness is fantastic.",
            timestamp: new Date("2023-10-27T10:20:00Z"),
        },
    },
    {
        sender: {
            text: "Let's test the MERN stack's performance under load.",
            timestamp: new Date("2023-10-27T10:25:00Z"),
        },
        receiver: {
            text: "Sounds good. Let's run some load tests later today.",
            timestamp: new Date("2023-10-27T10:30:00Z"),
        },
    },
    {
        sender: {
          text: "This could really grow into something big.",
          timestamp: new Date("2023-10-27T10:20:00Z"),
        },
        receiver: {
          text: "For sure. Has all the features people want.",
          timestamp: new Date("2023-10-27T10:22:00Z"),
        },
      }
];

 export const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey How are you?", isSent: false },
    { id: 2, content: "Hi iam doing great", isSent: true },
  ];

  export const formTitle = {
    login: "Login to your account",
    signup: "Create your account",
    otp: "Verify OTP",
    email: "Verify Email",
    reset: "Reset Password",
  };

  export const formBottomText = {
    login: "Don't have an account?",
    signup: "Already a Pixster user?",
    otp: "Back to login",
    email: "Back to login",
    reset: "Back to login",
  };

export const GEMINI_QUERY_INITAL = "You are a professional social media caption generator. Based on the following user query, suggest 10 unique, creative, and engaging captions, including a mix of captions with and without emojis. The captions should be concise, under 190 characters each. User Query: ";

export const GEMINI_QUERY_END = `. 
Only return the captions as a plain JavaScript array of strings, comma-separated and wrapped in square brackets, like this example: 
[
  "Just got my dream ride! 🚗✨ New adventures await.",
  "This SUV isn't just a vehicle — it's a lifestyle upgrade.",
  "Riding high in my new SUV 🛻💨 Ready for the road.",
  "Comfort. Power. Style. That’s my kind of SUV.",
  "SUV life: where the city ends and adventure begins 🌄🚙",
  "This baby handles like a dream. Smooth ride guaranteed.",
  "Turning heads, one smooth turn at a time 🔥",
  "New keys, new memories. Let’s roll! 🔑🚗",
  "My SUV is my new happy place 🖤",
  "Because adulting is better with horsepower 🐎🚙"
]`;
  