export const THEMES = [
    "black",
    "nord",
    "lofi",
  ];

  export const pairedMessages = [
    {
        sender: {
            text: "Hey, the Talkzy chat app is live on Vercel! Check it out.",
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
          text: "Who created this awesome app?",
          timestamp: new Date("2023-10-27T10:25:00Z"),
      },
      receiver: {
          text: "Yeah, I know the developer. His name is Midhun K Paniker.",
          timestamp: new Date("2023-10-27T10:30:00Z"),
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