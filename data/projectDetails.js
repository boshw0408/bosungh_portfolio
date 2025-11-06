/**
 * Project and Experience Details Data
 * Contains all descriptions for works and experiences
 * 
 * Structure for all entries:
 * 1. Hero image/video
 * 2. Description
 * 3. Tools
 * 4. Technical Implementation section
 * 5. Impact section
 */

export const projectDetails = {
  // Works
  campass: {
    title: "Campass",
    category: "work",
    description: 
    `Campass is a cross-platform campus discovery app designed to help UC Berkeley students easily find study spaces, hidden campus gems, and real-time convenience spots. It originally started as a small side project after noticing how difficult it was for students, especially newcomers, to discover useful locations like quiet study rooms, clean bathrooms, outlets, free food events, and late-night work areas. Campass centralizes all of these insights into one place, surfacing recommendations through curated tags, AI-generated summaries, and an interactive campus map.`,
    heroVideo: "./images/campassDemo.mp4",
    videos: ["./images/campassDemo.mp4"],
    sections: [
        {
        title: "Technical Implementation",
        content:
        `• Engineered a full-stack architecture with a React Native and TypeScript frontend and a Node.js/Express backend, using Firestore for data storage, then deployed with Render
• Built an API-driven ingestion pipeline to aggregate and normalize data across 500+ campus locations
• Integrated OpenAI's function-calling API to power an intelligent campus assistant capable of answering location-based questions with high accuracy, and generated dynamic short-form summaries for each location
• Implemented robust API routing, schema validation, and error handling, along with automated testing using Jest and CI/CD pipelines through GitHub Actions for reliable deployment and continuous integration`
      },
      {
        title: "Impact",
        content: `• Successfully launched MVP with 25+ active UC Berkeley students
• Aggregated data on 500+ campus locations
• Positioned into UC Berkeley SkyDeck 2025 cohort for multi-campus expansion`
      }
    ],
    tools: ["ReactNative", "Typescript", "Node.js", "Express.js", "FireBase", "Render", "Jest", "Github Actions"]
  },
  autotrip: {
    title: "AutoTrip",
    category: "work",
    description: `AutoTrip is an AI-powered travel planner that automates hotel selection, route planning, and restaurant recommendations to generate personalized, day-by-day itineraries. Users enter basic details such as dates, budget, group size, and interests, and AutoTrip finds optimal routes, recommends hotels at logical stopping points, and surfaces popular attractions and restaurants along the way. It then organizes everything into a complete itinerary with cost estimates, travel times, maps, and suggested stops, which could be all exportable as a PDF or synced to a calendar.`,
    heroVideo: "./images/AtuoTrip_demo.mp4",
    videos: ["./images/AtuoTrip_demo.mp4"],
    sections: [
      {
        title: "Technical Implementation",
        content: `• Designed frontend with a Next.js, TailwindCSS, Framer Motion, and React Query, then deployed on Vercel
• Built backend services with FastAPI and Pydantic, then deployed on Render
• Implemented asynchronous RESTful endpoints to aggregate real-time data across Google Maps, Amadeus, Yelp, and Instagram Graph APIs
• Engineered an AI itinerary generation engine using LangChain and OpenAI, producing route-optimized travel plans enriched with custom engagement metrics
• Implemented schema validation, error handling, and data normalization pipelines for reliable cross-API consistency
• Designed personalized ranking logic to prioritize user-preferred activities and recommend optimal travel sequences`
      },
      {
        title: "Impact",
        content: `• Reduced manual travel planning time without requiring users to compare multiple sources
• Achieved average of 600ms API latency`
      }
    ],
    tools: ["Next.js", "FastAPI", "LangChain", "TailwindCSS", "Framer Motion", "Pydantic", "Render", "Vercel"],
    websiteUrl: "https://autotripfrontend.vercel.app/"
  },
  snackhub: {
    title: "SnackHub",
    category: "work",
    description: `SnackHub is a gamified food ordering app designed to optimize cooking operations for small businesses while making the customer ordering experience more engaging through gamified and social features.`,
    heroImage: "./images/snackhub_logo.png",
    sections: [
      {
        title: "Technical Implementation",
        content: `• Led a 3-person team to design and develop the full stack architecture with React Native for cross-platform mobile development
• Deployed REST APIs on Google App Engine for scalable backend infrastructure
• Implemented a reward-based ordering system, personalized restaurant recommendations, and interactive UI elements to promote engagement and streamline ordering
• Implemented social features for enhanced user engagement and backend API for order management and user data`
      },
      {
        title: "Impact",
        content: `• Qualified for Naver D2 Startup Factory First Round
• Piloted the app with a local restaurant, gathering user feedback that improved usability and raised overall satisfaction by average of 60%`
      }
    ],
    tools: ["ReactNative", "Node.js", "Express.js", "Google App Engine"]
  },
  wikipedia_nlp: {
    title: "Wikipedia Talk-Page Comment Classification",
    category: "work",
    description: `End-to-end NLP pipeline to categorize editorial feedback on Wikipedia talk-page comments into three tiers: minor edits, moderate suggestions, and major disputes.`,
    heroImage: "./images/NLP.png",
    sections: [
      {
        title: "Technical Implementation",
        content: `• Fine-tuned a BERT model in PyTorch to understand context and semantic meaning of Wikipedia comments
• Preprocessed data using NLTK and evaluated model performance with scikit-learn metrics
• Developed a three-tier classification system categorizing comments into minor edits, moderate suggestions, and major disputes.`
      },
      {
        title: "Impact",
        content: `• Achieved 87% test accuracy, outperforming baseline methods by 22%
• The model successfully identifies the severity and nature of editorial feedback, enabling more efficient content moderation`
      }
    ],
    tools: ["PyTorch", "NLTK", "Scikit-learn", "NumPy"]
  },
  bobatime: {
    title: "Boba Time",
    category: "work",
    description: `Boba Time is an iOS application that recommends a personalized boba drink. The app guides users through series of MBTI personality traits questions to determine whether users prefer classic milk teas, fruit teas, brown sugar drinks, or more experimental combinations.`,
    heroVideo: "./images/BobaTime_demo.mp4",
    videos: ["./images/BobaTime_demo.mp4"],
    sections: [
      {
        title: "Technical Implementation",
        content: `• Built iOS app using Swift and SwiftUI/UX framework
• Integrated Firebase for real-time data synchronization and user preference storage
• Developed a custom recommendation algorithm based on user MBTI preferences and taste profiles
• Created an interactive quiz interface to gather user preferences`
      },
      {
        title: "Impact",
        content: `• Winner of the UC Berkeley Cubstart App Competition for Creativity and Innovation Section`
      }
    ],
    tools: ["Swift", "SwiftUI/UX", "FireBase"]
  },

  // Experiences
  notebar: {
    title: "Software Engineering Intern",
    company: "NoteBar, NY",
    role: "Full Stack & ML Development",
    category: "experience",
    description: `Notebar is an intelligent note-taking and concept management platform that captures, connects, and surfaces your ideas at the speed of search. It uses LLM-powered semantic search to provide instant context retrieval, automatically builds dynamic knowledge graphs as you write, and enables frictionless capture from web, chat, and voice, helping users transform scattered thoughts into connected, actionable knowledge`,
    heroImage: "./images/NoteBar_mainpage.png",
    sections: [
      {
        title: "Technical Implementation",
        content: `• Built and refined responsive UIs with React, TypeScript, and TailwindCSS, implementing clean authentication, navigation, and note composition flows with reusable components, proper state management, and edge-case handling
• Integrated FastAPI services deployed on Google Cloud Run, connecting the ML concept-classifier backend to the frontend
• Created a similarity scoring system that retrieved conceptually related notes written by the same user, leveraging Pinecone’s vector search and cosine similarity
• Designed and implemented an asynchronous real-time embedding pipeline (Firestore → FastAPI → Frontend) that automated embedding generation and indexing upon every note edit or creation
• Deployed all components in Dockerized environments and extended GitHub Actions CI/CD pipelines to automate retraining, testing, and redeployment`
      },
      {
        title: "Impact",
        content: `• Reduced end-to-end latency from several seconds to average of 900ms
• Transformed the system into a near real-time pipeline
• Delivered a production-ready demo showcased at the NYS Innovation Summit`
      }
    ],
    tools: ["Python", "Fast API", "Pinecone", "GitHub Actions", "Docker", "React", "TypeScript", "TailwindCSS", "Google Cloud Run", "Firebase"],
    websiteUrl: "https://okny.io/"
  },
  sky_computing_lab: {
    title: "Research Assistant",
    company: "Sky Computing Lab, Berkeley, CA",
    role: "Full Stack Development",
    category: "experience",
    description: `Chatbot Arena is a large-scale benchmarking platform for language models, developed at UC Berkeley’s Sky Computing Lab. It uses an A/B testing framework where users compare two anonymous model responses to the same prompt and vote for the better one. These votes provide direct human preference data that power open, community-driven leaderboards for LLM research.`,
    heroImage: "./images/lmArena_mainpage.png",
    sections: [
      {
        title: "Technical Implementation",
        content: `• Built and refined frontend components with Next.js/TailwindCSS and impelemented optimistic UI updates for instant feedback
• Extended server-side API endpoints in Node.js/HonoJS to handle vote submissions, parsing and validating JSON payloads
• Optimized backend performance by splitting synchronous and asynchronous writes, committing essential vote data immediately and batching non-critical metadata post-response to reduce latency
• Collaborated with researchers and engineers through weekly syncs, GitHub Issues, and pull request reviews`
      },
      {
        title: "Impact",
        content: `• Enhanced user engagement by nearly 20%
• Reduced API latency by nearly 30%
• Contributed to a platform now used by researchers and organizations worldwide to evaluate and compare the latest large language models`
      }
    ],
    tools: ["Next.js", "Postgres", "Tailwind", "ShadCN", "Hono"],
    websiteUrl: "https://lmarena.ai/"
  },
  karrot: {
    title: "Software Engineering Intern",
    company: "Karrot, South Korea",
    role: "Search & Discovery Team",
    category: "experience",
    description: `Karrot is a hyper-local community marketplace app with 30 million cumulative of users based in South Korea.`,
    heroImage: "./images/Karrot_screen.png",
    sections: [
      {
        title: "Technical Implementation",
        content: `• Extended and optimized the search API in EKS microservice architecture, refactoring filter-combinations logic
• Redesigned DynamoDB schema for search and feature retrieval by replacing unbounded Scan operations with composite keys and GSIs
• Conducted large-scale log analysis using Python and Pandas on JSON logs from S3`
      },
      {
        title: "Impact",
        content: `• Reduced DynamoDB query latency by nearly 30%
• Insights from log analysis accelerated rollout of a user-preference model for personalization, enhancing tailored search results and increasing engagement potential`
      }
    ],
    tools: ["S3", "EC2", "EKS", "DynamoDB", "CloudWatch", "Python", "Docker", "Kubernetes"],
    websiteUrl: "https://www.karrotmarket.com/"
  },
  san_diego_county: {
    title: "Data Science Internship",
    company: "San Diego County Taxpayers Association",
    category: "experience",
    description: `The San Diego County Taxpayers Association® is a non-profit, non-partisan organization, dedicated to promoting accountable, cost-effective and efficient government and opposing unnecessary taxes and fees.`,
    heroImage: "./images/SD-County-Taxpayers-Assn-logo.png",
    sections: [
      {
        title: "Technical Implementation",
        content: `• Automated the extraction of public expenditure data from government websites using web scraping techniques with Python libraries including Requests and BeautifulSoup
• Analyzed data with Pandas and created visualizations using Seaborn to communicate findings effectively`
      },
      {
        title: "Impact",
        content: `• Significantly reduced manual data collection effort, allowing the organization to focus on analysis and insights
• Created comprehensive reports analyzing housing trends, taxation patterns, and budget allocations that provided data-driven insights to support policy recommendations and informed decision-making for the San Diego County Taxpayers Association`
      }
    ],
    tools: ["Requests", "BeautifulSoup", "Pandas", "Seaborn"],
    websiteUrl: "https://www.sdcta.org/"
  },
  uc_berkeley_tutor: {
    title: "Undergraduate Course Staff/Tutor",
    company: "UC Berkeley, CA",
    role: "Principles & Techniques of Data Science (Data 100)",
    category: "experience",
    description: `CDSS tutors are undergraduate students who help teach and tutor other students in data science courses at UC Berkeley.`,
    sections: [
      {
        title: "Technical Implementation",
        content: `• Led weekly discussion sections covering core concepts in data science including data cleaning, statistical analysis, machine learning fundamentals, and data visualization
• Principles & Techniques of Data Science (Data 100) is a foundational course covering the complete data science pipeline: data collection, cleaning, analysis, visualization, and machine learning`
      },
      {
        title: "Impact",
        content: `• Supported student learning and success in a challenging course
• Helped students understand complex topics, debug code, and prepare for exams and projects
• Gained valuable experience in teaching, communication, and explaining technical concepts to diverse learners`
      }
    ],
    tools: ["Pandas", "NumPy", "Seaborn"]
  }
};

export default projectDetails;
