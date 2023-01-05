const skillsCats = [
    {
        category: 'Back-End',
        skills: [
            { label: 'GraphQL', score: 90 }
        ]
    },
    {
        category: 'Front-End',
        skills: [
            { label: 'HTML5 & CSS3', score: 90 }
        ]
    }
]

const dalveerEducation = [
    {
        gpa: "3.2",
        institute: 'Punjabi University',
        course: 'Bachelors of Computer Application',
    },
    {
        gpa: "3.6",
        institute: 'Lambton College',
        course: 'Computer Software and Database Development',
    }
]

const projects = [
    {
        userId: 1000,
        summary: 'Projects Summary',
        list: [
            {
                name: 'Portfolio Website',
                description: 'This is my portfolio website using Node & React',
                images: [] as string[]
            }
        ]
    },
    {
        userId: 1001,
        summary: 'Projects Summary',
        list: [
            {
                name: 'Banking Website',
                description: 'This is my portfolio website using Node & React',
                images: [] as string[]
            }
        ]
    },
]

export const data = {
    users: [
        {
            id: 1000,
            name: 'Dalveer Singh',
            email: 'dalveersidhu97@gmail.com',
            skills: {
                summary: 'Skills Summary',
                categories: skillsCats
            } || undefined,
            education: {
                summary: 'Education Summary',
                list: dalveerEducation
            } || undefined,
            about: 'I am a fullstack web developer near Toronto Ontario. I got my interests in coding since 12th grade thats why I did my Graduation and Postgraduation in computer application. Now, Coding has become my favourite passion and I love seeing the results of my efforts.',
            info: {
                experties: [
                    {
                        title: 'Fullstack Web development',
                        description: 'Single or Multipage fullstack websites using Node.js, Express.js, Next.js, React.js, Core PHP, Spring MVC, SQL or NoSQL databases etc.'
                    },
                    {
                        title: 'Front End Web Development',
                        description: 'I can build responsive front end websites using HTML, CSS, JS, React.js, JQery etc.'
                    },
                    {
                        title: 'API Development',
                        description: 'I can make APIs using Node.js, Next.js, Core PHP, MongoDB, Mongoose, SQL, Web Tokesn etc.'
                    },
                    {
                        title: 'Android Apps',
                        description: 'I am able to create such simple android apps that use simple UI, API calls, local storage. I made a Quiz app which avaliable in projects section.'
                    }
                ]
            } || undefined
        }
    ],
    projects: projects,
}